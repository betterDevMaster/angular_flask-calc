#!/usr/bin/python
# -*- coding: utf-8 -*-

from api.database.database import db
from api.models.models import User
from api.models.models import StressScenarioModel


def create_super_admin():

    # Check if admin exists in db.
    user = User.query.filter_by(email='test_username').first()

    # If user is none.
    if user is None:

        # Create admin user if it does not existed.
        user = User(username='sa_username', password='sa_password',
                    email='sa_email@example.com', user_role='sa')

        # Add user to session.
        db.session.add(user)
        db.session.commit()
        # Print admin user status.
        print("Super admin was set.")

    else:
        # Print admin user status.
        print("Super admin already set.")
    # db.session.close()


def create_admin_user():

    # Check if admin exists in db.
    user = User.query.filter_by(email='admin').first()

    # If user is none.
    if user is None:

        # Create admin user if it does not existed.
        user = User(username='admin_username', password='admin_password',
                    email='admin_email@example.com', user_role='admin')

        # Add user to session.
        db.session.add(user)
        db.session.commit()
        # Print admin user status.
        print("Admin was set.")

    else:
        # Print admin user status.
        print("Admin already set.")
    # db.session.close()


def create_test_user(username=None, password=None, email=None, user_role=None):

    # Check if admin exists in db.
    user = User.query.filter_by(email='test_username').first()

    # If user is none.
    if user is None:

        # Create admin user if it does not existed.
        # user = User(username=username, password=password, email=email, user_role=user_role)
        user = User(username='test_username', password='test_password', email='test_email@example.com',
                    user_role='user')

        # Add user to session.
        db.session.add(user)
        db.session.commit()
        # Print admin user status.
        print("Test user was set.")
    else:
        # Print admin user status.
        print("User already set.")
    # db.session.close()


def create_default_stressScenario():

    # Check if admin exists in db.
    dbStressScenario = StressScenarioModel.query.filter_by(
        remainingsp=212143.21, remaininghorizon=14).first()
    # If user is none.
    if dbStressScenario is None:
        stressScenario = StressScenarioModel(remainingsp=212143.21, remaininghorizon=14,
                                             lendingrate=0.575, sp=500000, horizon=35)

        # Add user to session.
        db.session.add(stressScenario)
        db.session.commit()
        # Print admin user status.
        print("Default stressScenario created.")
    else:
        # Print admin user status.
        print("stressScenario already set.")
    # db.session.close()
