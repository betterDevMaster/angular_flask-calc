#!/usr/bin/python
# -*- coding: utf-8 -*-

import os
import logging
from os.path import join, dirname
import api.error.errors as error
from flask import Flask, render_template, g, request, send_file, Flask, send_from_directory, flash, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from api.conf.routes import generate_routes
from api.conf.config import app_config
from api.database.database import db
from api.db_initializer.db_initializer import (
    create_admin_user, create_super_admin, create_test_user, create_default_stressScenario)
import zipfile
from api.models.models import Blacklist, User, Language, Country
from flask_mail import Mail, Message
from dotenv import load_dotenv
from flask_bcrypt import Bcrypt


dotenv_path = join(dirname(__file__), '.env')
load_dotenv(dotenv_path)


config_name = os.getenv('FLASK_ENV')
app = Flask(__name__)
app.config.from_object(app_config[config_name])
CORS(app)
Mail(app)


db.init_app(app)
generate_routes(app)
# Check if there is no database.
if not os.path.exists(app.config['SQLALCHEMY_DATABASE_URI']):
    db.app = app
    db.create_all()

# @app.route('/')
# def index():
#     return "<h1>Welcome to our server(2021/2/7/)</h1>"


@app.route('/uploads/<path:filename>', methods=['GET', 'POST'])
def download(filename):
    uploads = os.path.join(app.config['UPLOAD_FOLDER'])
    return send_from_directory(directory=uploads, filename=filename, as_attachment=True)


create_default_stressScenario()

if __name__ == '__main__':
    app.run(threaded=True, port=5000, debug=app.config['DEBUG'])
