import logging
import json
from datetime import datetime

from flask import g, request
from flask_restful import Resource

import api.error.errors as error
from api.conf.auth import auth, refresh_jwt
from api.database.database import db
from api.models.models import Language, LanguageDetail, LanguageComponent
from api.schemas.schemas import LanguageSchema, LanguageComponentSchema, LanguageDetailSchema
from flask import jsonify


# Languages
class LanguagesAllData(Resource):
    # @auth.login_required
    # @role_required.permission(2)
    def get(self):
        try:
            languages = Language.query.all()
            
            # Create user schema for serializing.
            language_schema = LanguageSchema(many=True)

            # Get json data
            data = language_schema.dump(languages)
            # Return json data from db.
            return data

        except Exception as why:

            # Log the error.
            logging.error(why)

            # Return error.
            return error.INVALID_INPUT_422

class LanguageData(Resource):
    # @auth.login_required
    # @role_required.permission(2)
    def get(self):
        try:
            lang_id = request.args.get('id')
            lang = LanguageDetail.query.filter_by(lang_id=lang_id).all()
            # Create schema for serializing.
            lang_schema = LanguageDetailSchema(many=True)
            # Get json data
            data = lang_schema.dump(lang)

            # Return json data from db.
            return data

        except Exception as why:

            # Log the error.
            logging.error(why)

            # Return error.
            return error.INVALID_INPUT_422
    
    def post(self):
        # print('detail print')
        try:
            # get data
            langs = request.json
            # print('page_id is')
            # print(page_id)
        except Exception as why:
            # Log input strip or etc. errors.
            logging.info("data wrong. " + str(why))
            # Return invalid input error.
            return error.INVALID_INPUT_422
        print('language data')
        for lang in langs:
            data = LanguageComponent.query.filter_by(lang_id=lang.get('lang_id'), category=lang.get('category'), page=lang.get('page'), name=lang.get('name')).first()
            if data is not None:
                data.val = lang.get('val')
                db.session.commit()
            else:
                data = LanguageComponent(lang_id=lang.get('lang_id'), category=lang.get('category'), page=lang.get('page'), name=lang.get('name'), val=lang.get('val'))
                db.session.add(data)
                db.session.commit()
        return {'status': 'Saved Successfully!'}

class LanguagePageData(Resource):
    # @auth.login_required
    # @role_required.permission(2)
    def get(self):
        try:
            lang_id = request.args.get('lang_id')
            page = request.args.get('page')
            lang = LanguageComponent.query.filter_by(lang_id=lang_id, page=page).all()
            # Create schema for serializing.
            lang_schema = LanguageComponentSchema(many=True)
            # Get json data
            data = lang_schema.dump(lang)

            # Return json data from db.
            return data

        except Exception as why:

            # Log the error.
            logging.error(why)

            # Return error.
            return error.INVALID_INPUT_422

class LanguageTitle(Resource):
    # @auth.login_required
    # @role_required.permission(2)
    def get(self):
        try:
            lang_id = request.args.get('id')
            languages = Language.query.filter_by(id=lang_id).all()
            
            # Create user schema for serializing.
            language_schema = LanguageSchema(many=True)

            # Get json data
            data = language_schema.dump(languages)
            # Return json data from db.
            return data

        except Exception as why:

            # Log the error.
            logging.error(why)

            # Return error.
            return error.INVALID_INPUT_422
    def post(self):
        try:
            # get data
            id, name, foreign, flag, status = request.json.get('id'), request.json.get('name'), request.json.get('foreign'), request.json.get('flag'), request.json.get('status')
            # print('name is')
            # print(lang_id)
        except Exception as why:
            # Log input strip or etc. errors.
            logging.info("data wrong. " + str(why))
            # Return invalid input error.
            return error.INVALID_INPUT_422
        # check if the same language exists
        data = Language.query.filter(Language.id != id, Language.name == name).first()
        if data is not None:
            return error.ALREADY_EXIST_LANGUAGE
        else:
            # check if data exists
            data = Language.query.filter_by(id=id).first()
            if data is not None:
                # return error.ALREADY_EXIST
                data.name = name
                data.foreign = foreign
                data.flag = json.dumps(flag)
                data.status = status
                db.session.commit()
                return {'status': 'Updated Successfully!'}
            else:
                # Create a new data.
                data = Language(name=name, foreign=foreign, flag=json.dumps(flag), status=status)
                # Add user to session.
                db.session.add(data)
                db.session.commit()
                new_id = Language.query.filter(Language.name == name).first().id
                # Return success if creation is completed.
                return {'status': 'Created successfully!', 'new_id': new_id}

class LanguageDelete(Resource):
    # @auth.login_required
    # @role_required.permission(2)
    def get(self):
        try:
            lang_id = request.args.get('id')
            print(lang_id)
            lang_details = LanguageComponent.query.filter_by(lang_id=lang_id).all()
            for lang_detail in lang_details:
                db.session.delete(lang_detail)
            lang_title = Language.query.filter_by(id=lang_id).first()
            # # Add user to session.
            db.session.delete(lang_title)
            db.session.commit()
            return {'status': 'Deleted!'}

        except Exception as why:

            # Log the error.
            logging.error(why)

            # Return error.
            return error.INVALID_INPUT_422

class LanguageStatus(Resource):
    # @auth.login_required
    # @role_required.permission(2)
    def get(self):
        try:
            languages = Language.query.filter_by(status=1).all()
            # Create user schema for serializing.
            language_schema = LanguageSchema(many=True)

            # Get json data
            data = language_schema.dump(languages)
            # Return json data from db.
            return data

        except Exception as why:

            # Log the error.
            logging.error(why)

            # Return error.
            return error.INVALID_INPUT_422
    def post(self):
        try:
            # get data
            id, status = request.json.get('id'), request.json.get('status')
        except Exception as why:
            # Log input strip or etc. errors.
            logging.info("data wrong. " + str(why))
            # Return invalid input error.
            return error.INVALID_INPUT_422
        # check if data exists
        data = Language.query.filter_by(id=id).first()
        if data is not None:
            # return error.ALREADY_EXIST
            data.status = status
            db.session.commit()
            return {'status': 'Updated Successfully!'}
        else:
            return error.INVALID_INPUT_422

class LanguageComponentData(Resource):
    # @auth.login_required
    # @role_required.permission(2)
    def get(self):
        try:
            lang_id = request.args.get('lang_id')
            category = request.args.get('category')
            langs = LanguageComponent.query.filter_by(lang_id=lang_id, category=category).all()
            # Create schema for serializing.
            lang_schema = LanguageComponentSchema(many=True)
            # Get json data
            data = lang_schema.dump(langs)
            # Return json data from db.
            return data

        except Exception as why:

            # Log the error.
            logging.error(why)

            # Return error.
            return error.INVALID_INPUT_422
    
    def post(self):
        # print('detail print')
        try:
            # get data
            lang_id, category, page, name, val = request.json.get('lang_id'), request.json.get('category'), request.json.get('page'), request.json.get('name'), request.json.get('val')
        except Exception as why:
            # Log input strip or etc. errors.
            logging.info("data wrong. " + str(why))
            # Return invalid input error.
            return error.INVALID_INPUT_422
        # check if data exists
        data = LanguageComponent.query.filter_by(lang_id=lang_id, category=category, page=page, name=name).first()
        # if data exists.
        if data is not None:
            # return error.ALREADY_EXIST
            data.val = val
            db.session.commit()
            # Return success if update is completed.
            return {'status': 'Updated Successfully!'}
        else:
            # Create a new data.
            data = LanguageComponent(lang_id=lang_id, category=category, page=page, name=name, val=val)
            # Add user to session.
            db.session.add(data)
            # Commit session.
            db.session.commit()

            # Return success if creation is completed.
            return {'status': 'Created Successfully!'}

class LanguageComponentDataAll(Resource):
    # @auth.login_required
    # @role_required.permission(2)
    def get(self):
        try:
            lang_id = request.args.get('lang_id')
            langs = LanguageComponent.query.filter_by(lang_id=lang_id).all()
            # Create schema for serializing.
            lang_schema = LanguageComponentSchema(many=True)
            # Get json data
            data = lang_schema.dump(langs)
            # Return json data from db.
            return data

        except Exception as why:

            # Log the error.
            logging.error(why)

            # Return error.
            return error.INVALID_INPUT_422

