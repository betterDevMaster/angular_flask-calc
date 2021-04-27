#!/usr/bin/python
# -*- coding: utf-8 -*-

SERVER_ERROR_500 = ({"message": "An error occured."}, 500)
NOT_FOUND_404 = ({"message": "Resource could not be found."}, 404)
NO_INPUT_400 = ({"message": "No input data provided."}, 400)
INVALID_INPUT_422 = ({"message": "Invalid input."}, 422)
ALREADY_EXIST = ({"message": "This email address already exists!"}, 409)
ALREADY_EXIST_LANGUAGE = ({"message": "This language already exists."}, 409)
DOES_NOT_EXIST = ({"message": "This user doesn't exist."}, 409)
PASSWORD_NOT_MATCH = ({"message": "Incorrect email or password."}, 409)
CONFIRM_EMAIL = ({"message": "Check email to activate your account."}, 409)
NOT_ADMIN = ({"message": "Admin permission denied."}, 999)
HEADER_NOT_FOUND = ({"message": "Header does not exists."}, 999)
