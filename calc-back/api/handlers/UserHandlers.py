#!/usr/bin/python
# -*- coding: utf-8 -*-

import logging
import json
import datetime
from flask_bcrypt import Bcrypt
from flask import g, request, render_template, current_app as app
from flask_restful import Resource
import api.error.errors as error
from api.conf.auth import auth, refresh_jwt
from api.database.database import db
from api.models.models import Blacklist, User, Language, Country
from api.roles import role_required
from api.schemas.schemas import UserSchema
from flask import jsonify
from flask_mail import Mail
from itsdangerous import URLSafeTimedSerializer
from flask_mail import Message

bcrypt = Bcrypt()
mail = Mail()


class Welcome(Resource):
    def get(self):
        return "Welcome to our server(2021/3/2/4000)"


class TokenManager(object):
    def generate_confirmation_token(email=''):
        serializer = URLSafeTimedSerializer(app.config['SECRET_KEY'])
        return serializer.dumps(email, salt=app.config['SECURITY_PASSWORD_SALT'])

    def confirm_token(token='', expiration=3600):
        serializer = URLSafeTimedSerializer(app.config['SECRET_KEY'])
        try:
            email = serializer.loads(
                token,
                salt=app.config['SECURITY_PASSWORD_SALT'],
                max_age=expiration
            )
        except:
            return False
        return email

    def send_email(to='', subject='', template=''):
        msg = Message(
            subject,
            recipients=[to],
            html=template,
            sender=app.config['MAIL_DEFAULT_SENDER']
        )
        mail.send(msg)
# Auth


class Login(Resource):
    @staticmethod
    def post():
        try:
            # Get user email and password.
            email, password = request.json.get(
                'email').strip(), request.json.get('password').strip()

        except Exception as why:

            # Log input strip or etc. errors.
            logging.info("Email or password is wrong. " + str(why))

            # Return invalid input error.
            return error.INVALID_INPUT_422
        if email is None or password is None:
            return error.INVALID_INPUT_422
        # Get user if it exists.
        user = User.query.filter_by(email=email).first()
        # Check if user is not existed.
        if user is None:
            return error.DOES_NOT_EXIST
        # Check password
        elif not user.confirmed:
            return {'status': 'info', 'msg': 'Check email to activate your account.'}
        else:
            password_db = user.password
            if not bcrypt.check_password_hash(password_db.encode(), password):
                return error.PASSWORD_NOT_MATCH
        # If user is admin.
        if user.user_role.name == 'admin':
            # Generate access token. This method takes boolean value for checking admin or normal user. Admin: 1 or 0.
            access_token = user.generate_auth_token(0)
        # If user is an individual.
        elif user.user_role.name == 'individual':

            # Generate access token. This method takes boolean value for checking admin or normal user. Admin: 2, 1, 0.
            access_token = user.generate_auth_token(1)
        # If user is content provider.
        elif user.user_role.name == 'content':

            # Generate access token. This method takes boolean value for checking admin or normal user. Admin: 1 or 0.
            access_token = user.generate_auth_token(2)
        # If user is content provider, but can be normal individual too.
        elif user.user_role.name == 'both':

            # Generate access token. This method takes boolean value for checking admin or normal user. Admin: 2, 1, 0.
            access_token = user.generate_auth_token(3)
        else:
            return error.INVALID_INPUT_422

        # Generate refresh token.
        refresh_token = refresh_jwt.dumps({'email': email})
        # Get country name
        country = Country.query.filter_by(id=user.user_country).first()
        country_name = country.name
        fx = country.fx
        # Get language name
        language = Language.query.filter_by(id=user.user_language).first().name
        # Return access token and refresh token.
        return {'status': 'success', 'id': user.id, 'user_role': user.user_role.name, 'first_name': user.first_name, 'last_name': user.last_name, 'email': user.email, 'user_language': user.user_language, 'user_country': user.user_country, 'fx': fx, 'country': country_name, 'language': language, 'street': user.street, 'nr': user.nr, 'zipcode': user.zipcode, 'city': user.city, 'access_token': access_token.decode(), 'refresh_token': refresh_token.decode()}


class Register(Resource):
    @staticmethod
    def post():
        try:
            # Get username, password and email.
            email, password, first_name, last_name, user_role, user_country, user_language = request.json.get('email').strip(), request.json.get('password').strip(
            ),  request.json.get('firstName').strip(), request.json.get('lastName').strip(), request.json.get('role'), request.json.get('country'), request.json.get('language')
        except Exception as why:
            # Log input strip or etc. errors.
            logging.info("Username, password or email is wrong. " + str(why))

            # Return invalid input error.
            return error.INVALID_INPUT_422

        # Check if any field is none.
        if password is None or email is None:
            return error.INVALID_INPUT_422

        # Get user if it exists.
        user = User.query.filter_by(email=email).first()
        print('user is registered now')
        # Check if user exists.
        if user is not None:
            return error.ALREADY_EXIST
        pwd_encrypt = bcrypt.generate_password_hash(password).decode()
        # Create a new user.
        user = User(email=email, password=pwd_encrypt, first_name=first_name, last_name=last_name,
                    user_role=user_role, user_country=user_country, user_language=user_language, confirmed=False)
        db.session.add(user)
        db.session.commit()
        token = TokenManager.generate_confirmation_token(email=email)
        confirm_url = app.config['FRONT_URL'] + '/confirm/' + token
        html = render_template('activate.html', confirm_url=confirm_url)
        subject = "Please confirm your email"
        TokenManager.send_email(to=email, subject=subject, template=html)
        return {'status': 'success', 'message': 'A confirmation email has been sent via email.'}


class ConfirmEmail(Resource):
    @staticmethod
    def post():
        try:
            token = request.json.get('token')
            email = TokenManager.confirm_token(token)
        except:
            return {'status': 'error', 'msg': 'The confirmation link is invalid or has expired. Please register again.'}
        if email is False:
            return {'status': 'error', 'msg': 'The confirmation link is invalid or has expired. Please register again.'}
        user = User.query.filter_by(email=email).first_or_404()
        if user.confirmed:
            # db.session.remove()
            return {'status': 'success', 'msg': 'Account already confirmed. Please login.'}
        else:
            db.session.query(User).filter_by(email=email).update(
                {"confirmed": True, "confirmed_on": datetime.datetime.now()})
            db.session.commit()
            return {'status': 'success', 'msg': 'You have confirmed your account. Thanks!'}


class ForgotPassword(Resource):
    @staticmethod
    def post():
        try:
            email = request.json.get('email').strip()
        except Exception as why:
            logging.info("Email is wrong. " + str(why))
            return error.INVALID_INPUT_422
        # Get user.
        user = User.query.filter_by(email=email).first()
        # Check if user exists.
        if user is None:
            return {'status': 'error', 'msg': 'This email is unavailable.'}
        token = TokenManager.generate_confirmation_token(email=email)
        confirm_url = app.config['FRONT_URL'] + '/recover-password/' + token
        html = render_template('recover-password.html',
                               confirm_url=confirm_url)
        subject = "Please confirm your email"
        TokenManager.send_email(to=email, subject=subject, template=html)
        return {'status': 'success', 'msg': 'Please check email to reset your password.'}


class ResendEmail(Resource):
    @staticmethod
    def post():
        try:
            email = request.json.get('email').strip()
        except Exception as why:
            # Log input strip or etc. errors.
            logging.info("Email is wrong. " + str(why))
            # Return invalid input error.
            return error.INVALID_INPUT_422
        token = TokenManager.generate_confirmation_token(email)
        confirm_url = app.config['FRONT_URL'] + '/confirm/' + token
        html = render_template('activate.html', confirm_url=confirm_url)
        subject = "Please confirm your email"
        TokenManager.send_email(email, subject, html)
        return {'status': 'success', 'msg': 'A new confirmation email has been sent.'}


class ResetPassword(Resource):
    @staticmethod
    def post():
        try:
            token = request.json.get('token')
            email = TokenManager.confirm_token(token)
        except:
            return {'status': 'error', 'msg': 'Invalid email.'}
        if email is False:
            return {'status': 'error', 'msg': 'The confirmation link is invalid or has expired. Please register again.'}
        password = request.json.get('password')
        user = User.query.filter_by(email=email).first_or_404()
        if user is None:
            return {'status': 'error', 'msg': 'This user is unavailable.'}
        password_db = user.password
        if bcrypt.check_password_hash(password_db.encode(), password):
            return {'status': 'warning', 'msg': 'You have used this password before. Please insert another one.'}
        pwd_encrypt = bcrypt.generate_password_hash(password).decode()
        db.session.query(User).filter_by(
            email=email).update({"password": pwd_encrypt})
        db.session.commit()
        return {'status': 'success', 'msg': 'Updated password. Please sign in now.'}


class Logout(Resource):
    @staticmethod
    @auth.login_required
    def post():

        # Get refresh token.
        refresh_token = request.json.get('refresh_token')

        # Get if the refresh token is in blacklist
        ref = Blacklist.query.filter_by(refresh_token=refresh_token).first()

        # Check refresh token exists.
        if ref is not None:
            return {'status': 'already invalidated', 'refresh_token': refresh_token}

        # Create a blacklist refresh token.
        blacklist_refresh_token = Blacklist(refresh_token=refresh_token)

        # Add refresh token to session.
        db.session.add(blacklist_refresh_token)

        # Commit session.
        db.session.commit()
        # Return status of refresh token.
        return {'status': 'invalidated', 'refresh_token': refresh_token}


class RefreshToken(Resource):
    @staticmethod
    def post():

        # Get refresh token.
        refresh_token = request.json.get('refresh_token')

        # Get if the refresh token is in blacklist.
        ref = Blacklist.query.filter_by(refresh_token=refresh_token).first()

        # Check refresh token exists.
        if ref is not None:
            # Return invalidated token.
            return {'status': 'invalidated'}

        try:
            # Generate new token.
            data = refresh_jwt.loads(refresh_token)

        except Exception as why:
            # Log the error.
            logging.error(why)

            # If it does not generated return false.
            return False

        # Create user not to add db. For generating token.
        user = User(email=data['email'])

        # New token generate.
        token = user.generate_auth_token(False)
        # Return new access token.
        return {'access_token': token}


class UsersAllData(Resource):
    # @auth.login_required
    # @role_required.permission(2)
    def get(self):
        try:
            # users = User.query.all()
            users = User.query.join(Language, User.user_language == Language.id).join(Country, User.user_country == Country.id).add_columns(User.id, User.first_name, User.last_name,
                                                                                                                                            User.email, User.user_role, Language.name.label('language'), Country.name.label('country'), Language.id.label('language_id'), Country.id.label('country_id')).all()
            # Create user schema for serializing.
            user_schema = UserSchema(many=True)
            # Get json data
            data = user_schema.dump(users)
            # Return json data from db.
            return data

        except Exception as why:

            # Log the error.
            logging.error(why)

            # Return error.
            return error.INVALID_INPUT_422

# auth.login_required: Auth is necessary for this handler.
# role_required.permission: Role required user=0, admin=1 and super admin=2.


class UsersData(Resource):
    @auth.login_required
    @role_required.permission(2)
    def get(self):
        try:

            # Get usernames.
            usernames = [] if request.args.get(
                'usernames') is None else request.args.get('usernames').split(',')

            # Get emails.
            emails = [] if request.args.get(
                'emails') is None else request.args.get('emails').split(',')

            # Get start date.
            start_date = datetime.strptime(
                request.args.get('start_date'), '%d.%m.%Y')

            # Get end date.
            end_date = datetime.strptime(
                request.args.get('end_date'), '%d.%m.%Y')

            # Filter users by usernames, emails and range of date.
            users = User.query\
                .filter(User.username.in_(usernames))\
                .filter(User.email.in_(emails))\
                .filter(User.created.between(start_date, end_date))\
                .all()

            # Create user schema for serializing.
            user_schema = UserSchema(many=True)

            # Get json data
            data, errors = user_schema.dump(users)

            # Return json data from db.
            return data

        except Exception as why:

            # Log the error.
            logging.error(why)

            # Return error.
            return error.INVALID_INPUT_422

# auth.login_required: Auth is necessary for this handler.
# role_required.permission: Role required user=0, admin=1 and super admin=2.


class UserUpdate(Resource):
    # @auth.login_required
    # @role_required.permission(0)
    def put(self):
        # try:
        id, email, first_name, last_name, user_country, user_language, street, nr, zipcode, city = request.json.get('id'), request.json.get('email'), request.json.get(
            'first_name'), request.json.get('last_name'), request.json.get('user_country'), request.json.get('user_language'), request.json.get('street'), request.json.get('nr'), request.json.get('zipcode'), request.json.get('city')
        # Get user data
        user = User.query.filter_by(id=id).first()
        print('user')
        print(user)
        if user is None:
            return 'No User Fund'

        if email:
            user.email = email
        if first_name:
            user.first_name = first_name
        if last_name:
            user.last_name = last_name
        if user_country:
            user.user_country = user_country
        if user_language:
            user.user_language = user_language
        if street:
            user.street = street
        if nr:
            user.nr = nr
        if zipcode:
            user.zipcode = zipcode
        if city:
            user.city = city
        db.session.commit()
        return {'status': 'Updated'}
        # except Exception as why:
        #     # Log the error.
        #     logging.error(why)
        #     # Return error.
        #     return error.INVALID_INPUT_422


class UserData(Resource):
    # @auth.login_required
    # @role_required.permission(2)
    def get(self):
        try:
            # Get user id
            userid = request.args.get('id')
            users = User.query.filter_by(id=userid).join(Language, User.user_language == Language.id).join(Country, User.user_country == Country.id).add_columns(
                User.id, User.first_name, User.last_name, User.email, User.user_role, User.user_country, User.user_language, User.street, User.nr, User.zipcode, User.city, Language.name.label('language'), Country.name.label('country')).all()
            # Create user schema for serializing.
            user_schema = UserSchema(many=True)
            # Get json data
            data = user_schema.dump(users)
            print('users')
            print(users)
            # Return json data from db.
            return data

        except Exception as why:
            # Log the error.
            logging.error(why)
            # Return error.
            return error.INVALID_INPUT_422

# auth.login_required: Auth is necessary for this handler.
# role_required.permission: Role required user=0, admin=1 and super admin=2.


class DataAdminRequired(Resource):
    @auth.login_required
    @role_required.permission(1)
    def get(self):

        return "Test admin data OK."


class AddUser(Resource):
    @auth.login_required
    @role_required.permission(2)
    def get(self):

        return "OK"


class DataUserRequired(Resource):

    @auth.login_required
    def get(self):

        return "Test user data OK."
