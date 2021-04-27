import logging
import json
from metomi.isodatetime.parsers import TimePointParser
from datetime import date
from datetime import datetime
import numpy as np
import os
import decimal
import random
from flask import g, request, current_app as app
from flask_restful import Resource
# import numpy as np
import numpy_financial as np
import api.error.errors as error
from api.conf.auth import auth, refresh_jwt
from werkzeug.utils import secure_filename
from api.database.database import db
from api.models.models import User, Country, Content, IndBasisModel, IndIndividualModel, IndSpecialModel, IndHouseholdModel, IndLivingspaceModel, IndProjectModel, IndDocumentsModel, StressScenarioModel, UserStressScenarioModel
# from api.models.models import Country, Content
from flask import jsonify
from flask import send_file, Flask, send_from_directory
from api.schemas.schemas import CountrySchema, VariantType, IndividualBasisSchema, IndividualIndividualSchema, IndividualSpecialSchema, IndividualHouseholdSchema, IndividualLivingspaceSchema, IndividualProjectcostSchema, IndividualDocumentsSchema, StressScenarioSchema, UserStressScenarioSchema

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif', 'doc', 'docx'}


class IndividualBasis(Resource):
    # @auth.login_required
    # @role_required.permission(2)
    def get(self):
        try:
            user_id = request.args.get('user_id')
            basis = IndBasisModel.query.filter_by(user_id=user_id).all()
            # Create user schema for serializing.
            data_schema = IndividualBasisSchema(many=True)
            # Get json data
            data = data_schema.dump(basis)
            if len(data) > 0:
                outputs = CalcData.calcBasis(data[0])
                data.append(outputs)
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
            user_id = request.json.get('user_id')
        except Exception as why:
            # Log input strip or etc. errors.
            logging.info("data wrong. " + str(why))
            # Return invalid input error.
            return error.INVALID_INPUT_422
        outputs = CalcData.calcBasis(request.json)
        if(user_id != 0 and outputs.get('status') == 'success'):
            CalcData.saveBasis(request.json)
        return outputs


class IndividualIndividual(Resource):
    # @auth.login_required
    # @role_required.permission(2)
    def get(self):
        try:
            user_id = request.args.get('user_id')
        except Exception as why:
            # Log the error.
            logging.error(why)
            # Return error.
            return error.INVALID_INPUT_422

        basis = IndBasisModel.query.filter_by(user_id=user_id).all()
        data_schema = IndividualBasisSchema(many=True)
        basis_data = data_schema.dump(basis)

        if len(basis_data) > 0:
            individual = IndIndividualModel.query.filter_by(
                user_id=user_id).all()
            # Create user schema for serializing.
            data_schema = IndividualIndividualSchema(many=True)
            # Get json data
            individual_data = data_schema.dump(individual)
        else:
            return {'status': 'error', 'msg': 'You need to calculate the payment rate on basis page to get special results!'}

        # get basis data for individual calculation
        basis_outputs = CalcData.calcBasis(basis_data[0])
        if basis_outputs.get('status') == 'error':
            return basis_outputs
        individual_inputs = CalcData.convertIndividual(
            basis_data, basis_outputs, individual_data)
        if len(individual_data) > 0:
            individual_outputs = CalcData.calcIndividual(individual_inputs)
            return {'status': 'success', 'individual_outputs': individual_outputs, 'individual_data': individual_inputs}
        else:
            return {'status': 'empty_inputs', 'individual_data': individual_inputs}

    def post(self):
        # try:
        #     # get data
        #     user_id, address, age, field_work, guarantor, highest_degree, job_position, kids, martial_status, net_income, own_funds, pr, basis_data = request.json.get('user_id'), request.json.get('address'), request.json.get('age'),  request.json.get('field_work'),  request.json.get('guarantor'), request.json.get('highest_degree'), request.json.get('job_position'), request.json.get('kids'), request.json.get('martial_status'), request.json.get('net_income'), request.json.get('own_funds'), request.json.get('pr'), request.json.get('basis_data')
        # except Exception as why:
        #     # Log input strip or etc. errors.
        #     logging.info("data wrong. " + str(why))
        #     # Return invalid input error.
        #     return error.INVALID_INPUT_422

        # get data
        user_id, address, age, field_work, guarantor, highest_degree, job_position, kids, martial_status, net_income, own_funds, pr, basis_data = request.json.get('user_id'), request.json.get('address'), request.json.get('age'),  request.json.get('field_work'),  request.json.get(
            'guarantor'), request.json.get('highest_degree'), request.json.get('job_position'), request.json.get('kids'), request.json.get('martial_status'), request.json.get('net_income'), request.json.get('own_funds'), request.json.get('pr'), request.json.get('basis_data')
        outputs = CalcData.calcIndividual(request.json)
        if(user_id != 0 and outputs.get('status') == 'success'):
            CalcData.saveIndividual(request.json)
        return {'status': 'success', 'individual_outputs': outputs}


class IndividualBasisSave(Resource):
    # @auth.login_required
    # @role_required.permission(2)
    def post(self):
        try:
            # get data
            user_id = request.json.get('user_id')
        except Exception as why:
            # Log input strip or etc. errors.
            logging.info("data wrong. " + str(why))
            # Return invalid input error.
            return error.INVALID_INPUT_422
        if(user_id != 0):
            CalcData.saveBasis(request.json)
        return {'status': 'success'}


class IndividualIndividualSave(Resource):
    # @auth.login_required
    # @role_required.permission(2)
    def post(self):
        try:
            # get data
            user_id = request.json.get('user_id')
        except Exception as why:
            # Log input strip or etc. errors.
            logging.info("data wrong. " + str(why))
            # Return invalid input error.
            return error.INVALID_INPUT_422

        if(user_id != 0):
            CalcData.saveIndividual(request.json)
        return {'status': 'success'}


class IndividualLocalSave(Resource):
    # @auth.login_required
    # @role_required.permission(2)
    def post(self):
        try:
            # get data
            basisInputs = request.json.get('basisInputs')
            individualInputs = request.json.get('individualInputs')
        except Exception as why:
            # Log input strip or etc. errors.
            logging.info("data wrong. " + str(why))
            # Return invalid input error.
            return error.INVALID_INPUT_422
        CalcData.saveBasis(basisInputs)
        CalcData.saveIndividual(individualInputs)
        return {'status': 'success'}


class CalcCheckTbl(Resource):
    # @auth.login_required
    # @role_required.permission(2)
    def get(self):
        try:
            user_id = request.args.get('user_id')
            tbl_obj = {"basis": True, "individual": True, "special": True,
                       "household": True, "livingspace": True, "projectcost": True, "documents": True}
            basis = False if IndBasisModel.query.filter_by(
                user_id=user_id).first() is None else True
            individual = False if IndIndividualModel.query.filter_by(
                user_id=user_id).first() is None else True
            special = False if IndSpecialModel.query.filter_by(
                user_id=user_id).first() is None else True
            household = False if IndHouseholdModel.query.filter_by(
                user_id=user_id).first() is None else True
            livingspace = False if IndLivingspaceModel.query.filter_by(
                user_id=user_id).first() is None else True
            projectcost = False if IndProjectModel.query.filter_by(
                user_id=user_id).first() is None else True
            documents = False if IndDocumentsModel.query.filter_by(
                user_id=user_id).first() is None else True
            return {'basis': basis, 'individual': individual, 'special': special, 'household': household, 'livingspace': livingspace, 'projectcost': projectcost, 'documents': documents}
            # return {'basis': True, 'individual': True, 'special': True, 'household': True, 'livingspace': True, 'projectcost': True, 'documents': True}

        except Exception as why:

            # Log the error.
            logging.error(why)

            # Return error.
            return error.INVALID_INPUT_422


class IndividualSpecial(Resource):
    # @auth.login_required
    # @role_required.permission(2)
    def get(self):
        try:
            user_id = request.args.get('user_id')
        except Exception as why:
            # Log the error.
            logging.error(why)
            # Return error.
            return error.INVALID_INPUT_422

        data = IndSpecialModel.query.filter_by(user_id=user_id).all()
        # Create schema for serializing.
        content_schema = IndividualSpecialSchema(many=True)
        # Get special data
        special_data = content_schema.dump(data)
        return special_data

    def post(self):
        try:
            # get data
            inputs = request.json.get('inputs')
            address = request.json.get('address')
            user_id, natural_disasters, areas, additions = inputs.get('user_id'), inputs.get(
                'natural_disasters'), inputs.get('areas'), inputs.get('additions')
        except Exception as why:
            logging.info("data wrong. " + str(why))
            # Return invalid input error.
            return error.INVALID_INPUT_422
        # Save projectt data
        data = IndSpecialModel.query.filter_by(user_id=user_id).first()
        # if data exists.
        if data is not None:
            # return error.ALREADY_EXIST
            data.natural_disasters = json.dumps(natural_disasters)
            data.areas = json.dumps(areas)
            data.additions = json.dumps(additions)
            db.session.commit()
        else:
            # Create a new data
            data = IndSpecialModel(user_id=user_id, natural_disasters=json.dumps(
                natural_disasters), areas=json.dumps(areas), additions=json.dumps(additions))
            # Add user to session.
            db.session.add(data)
            # Commit session.
            db.session.commit()

        # Save address
        data = User.query.filter_by(id=user_id).first()
        # if data exists.
        if data is not None:
            # return error.ALREADY_EXIST
            data.street = address.get('street')
            data.nr = address.get('nr')
            data.zipcode = address.get('zipcode')
            data.city = address.get('city')
            db.session.commit()
            return {'status': 'success'}
        else:
            # Create a new data
            data = IndSpecialModel(street=address.get('street'), address=address.get(
                'nr'), zipcode=address.get('nr'), city=address.get('city'))
            # Add user to session.
            db.session.add(data)
            # Commit session.
            db.session.commit()

            # Return success if creation is completed.
            return {'status': 'success'}


class IndividualSpecialCalc(Resource):
    # @auth.login_required
    # @role_required.permission(2)
    def post(self):
        try:
            individual_data = request.json
        except Exception as why:
            # Log the error.
            logging.error(why)
            # Return error.
            return error.INVALID_INPUT_422

        user_id = individual_data.get('user_id')
        individual_outputs = CalcData.calcIndividual(individual_data)
        # save individual data to the database
        CalcData.saveIndividual(individual_data)
        return {'status': 'success', 'individual_outputs': individual_outputs}


class IndividualHouseholdCalc(Resource):
    # @auth.login_required
    # @role_required.permission(2)
    def post(self):
        try:
            # get data
            household_obj, martial_single, incomes, insurances, expenses, other_expenses, mobility, existing_assets = request.json, request.json.get('martial_single'), request.json.get(
                'income'), request.json.get('insurances'), request.json.get('expenses'),  request.json.get('other_expenses'),  request.json.get('mobility'), request.json.get('existing_assets')
        except Exception as why:
            logging.info("data wrong. " + str(why))
            # Return invalid input error.
            return error.INVALID_INPUT_422
        return CalcData.calcHousehold(request.json)


class IndividualHousehold(Resource):
    # @auth.login_required
    # @role_required.permission(2)
    def get(self):
        # try:
        user_id = request.args.get('user_id')
        data = IndHouseholdModel.query.filter_by(user_id=user_id).all()
        household_inputs_json = IndHouseholdModel.query.filter_by(
            user_id=user_id).first()
        individual_inputs = IndIndividualModel.query.filter_by(
            user_id=user_id).first()
        # # Create schema for serializing.
        content_schema = IndividualHouseholdSchema(many=True)
        # fx = CalcData.getFx(user_id)
        # # Get json data
        household_inputs = content_schema.dump(data)
        martial_status = json.loads(individual_inputs.martial_status)[0]
        martial_single = True if json.loads(individual_inputs.martial_status)[
            0] == 'martial_single' else False
        if(len(household_inputs) > 0):
            household_inputs_dict = {'martial_single': martial_single, 'income': json.loads(household_inputs[0].get('income')), 'insurances': json.loads(household_inputs[0].get('insurances')), 'expenses': json.loads(household_inputs[0].get(
                'expenses')), 'other_expenses': json.loads(household_inputs[0].get('other_expenses')), 'mobility': json.loads(household_inputs[0].get('mobility')), 'existing_assets': json.loads(household_inputs[0].get('existing_assets'))}
            household_outputs = CalcData.calcHousehold(household_inputs_dict)
            # Return json data from db.
            return {'status': 'success', 'inputs': household_inputs, 'martial_status': martial_status, 'household_outputs': household_outputs}
        else:
            return {'status': 'empty_inputs', 'inputs': household_inputs, 'martial_status': martial_status}

        # except Exception as why:

        #     # Log the error.
        #     logging.error(why)

        #     # Return error.
        #     return error.INVALID_INPUT_422
    def post(self):
        try:
            # get data
            user_id, income, insurances, expenses, other_expenses, mobility, existing_assets = request.json.get('user_id'), request.json.get('income'), request.json.get(
                'insurances'),  request.json.get('expenses'),  request.json.get('other_expenses'), request.json.get('mobility'), request.json.get('existing_assets')
        except Exception as why:
            # Log input strip or etc. errors.
            logging.info("data wrong. " + str(why))
            # Return invalid input error.
            return error.INVALID_INPUT_422

        # check if data exists
        data = IndHouseholdModel.query.filter_by(user_id=user_id).first()
        # if data exis
        if data is not None:
            # update da
            data.user_id = user_id
            data.income = json.dumps(income)
            data.insurances = json.dumps(insurances)
            data.expenses = json.dumps(expenses)
            data.other_expenses = json.dumps(other_expenses)
            data.mobility = json.dumps(mobility)
            data.existing_assets = json.dumps(existing_assets)
            db.session.commit()
        else:
            # Create a new data.
            data = IndHouseholdModel(user_id=user_id, income=json.dumps(income), insurances=json.dumps(insurances), expenses=json.dumps(
                expenses), other_expenses=json.dumps(other_expenses), mobility=json.dumps(mobility), existing_assets=json.dumps(existing_assets))
            db.session.add(data)
            db.session.commit()
        return {'status': 'success'}


class IndividualLivingspaceCalc(Resource):
    # @auth.login_required
    # @role_required.permission(2)
    def post(self):
        try:
            # get data
            floor_total = request.json
        except Exception as why:
            logging.info("data wrong. " + str(why))
            # Return invalid input error.
            return error.INVALID_INPUT_422
        # get floor numbers
        floor_nums = len(floor_total)
        # define floor sums
        floor_sums = [0] * floor_nums
        floor_sums_total = 0
        floor_rooms = 0
        i = 0
        # calculate each floor sums
        for floor_inputs in floor_total:
            for floor_input in floor_inputs:
                if(type(floor_input.get('val')) == list):
                    for multi_room in floor_input.get('val'):
                        if(multi_room != None):
                            floor_sums[i] += multi_room
                            if(floor_input.get('room')):
                                floor_rooms += multi_room
                else:
                    if(floor_input.get('val') != None):
                        floor_sums[i] += floor_input.get('val')
                        if(floor_input.get('room')):
                            floor_rooms += floor_input.get('val')
            floor_sums_total += floor_sums[i]
            i += 1
        # Return success if creation is completed.
        return {'status': 'success', 'floor_sums': json.dumps(floor_sums), 'floor_sums_total': json.dumps(floor_sums_total), 'floor_rooms': json.dumps(floor_rooms)}


class IndividualLivingspace(Resource):
    # @auth.login_required
    # @role_required.permission(2)
    def get(self):
        try:
            user_id = request.args.get('user_id')
            data = IndLivingspaceModel.query.filter_by(
                user_id=user_id).order_by(IndLivingspaceModel.no.asc()).all()
            # # # Create schema for serializing.
            content_schema = IndividualLivingspaceSchema(many=True)

            # # # Get json data
            data = content_schema.dump(data)
            # # Return json data from db.
            return data

        except Exception as why:

            # Log the error.
            logging.error(why)

            # Return error.
            return error.INVALID_INPUT_422

    def post(self):
        try:
            # get data
            user_id, floors = request.json.get(
                'user_id'), request.json.get('floors')
        except Exception as why:
            # Log input strip or etc. errors.
            logging.info("data wrong. " + str(why))
            # Return invalid input error.
            return error.INVALID_INPUT_422
        i = 0
        for floor in floors:
            # check if data exists
            data = IndLivingspaceModel.query.filter_by(
                user_id=user_id, no=i).first()
            if data is not None:
                # update data
                data.user_id = user_id
                data.no = i
                data.val = json.dumps(floor)
                db.session.commit()
            else:
                # Create a new data.
                data = IndLivingspaceModel(
                    user_id=user_id, no=i, val=json.dumps(floor))
                db.session.add(data)
                db.session.commit()
            i += 1

        return {'status': 'success'}


class IndividualProjectcostCalc(Resource):
    # @auth.login_required
    # @role_required.permission(2)
    def post(self):
        try:
            # get data
            project_total = request.json
        except Exception as why:
            logging.info("data wrong. " + str(why))
            # Return invalid input error.
            return error.INVALID_INPUT_422
        # get floor numbers
        # project_nums = len(project_total)
        project_nums = 5
        # define floor sums
        project_costs = [0] * project_nums
        project_costs_sum = 0
        fundable_costs = 0
        i = 0
        # calculate each floor sums
        for key in project_total:
            for project_input in project_total[key]:
                if(project_input.get('val') == None or project_input.get('name') == 'turnkey_ready'):
                    continue
                if(project_input.get('name') != 'other_interior' and project_input.get('name') != 'road_charges'):
                    fundable_costs += project_input.get('val')
                project_costs[i] += project_input.get('val')
            project_costs_sum += project_costs[i]
            i += 1
        # Return success if creation is completed.
        return {'status': 'success', 'project_costs': json.dumps(project_costs), 'project_sum': project_costs_sum, 'fundable_sum': fundable_costs}


class IndividualProjectcostTurnkey(Resource):
    # @auth.login_required
    # @role_required.permission(2)
    def post(self):
        # try:
        #     # get data
        #     project_total = request.json.inputs
        #     turnkey = request.json.turnkey
        # except Exception as why:
        #     logging.info("data wrong. " + str(why))
        #     # Return invalid input error.
        #     return error.INVALID_INPUT_422
        # get floor numbers
        # project_nums = len(project_total)
        project_total = request.json.get('inputs')
        turnkey = json.loads(request.json.get('turnkey'))

        project_nums = 5
        # define floor sums
        project_costs = [0] * project_nums
        project_costs_sum = 0
        fundable_costs = 0
        offered_purchasing = 0
        i = 0
        # calculate each floor sums
        for key in project_total:
            if key == 'housebuilding':
                project_costs[0] = turnkey
                fundable_costs = turnkey
                for project_input in project_total[key]:
                    if(project_input.get('val') == None or project_input.get('name') == 'turnkey_ready' or project_input.get('name') == 'offered_purchasing'):
                        continue
                    if(project_input.get('name') == 'other_interior'):
                        fundable_costs -= project_input.get('val')
                    turnkey -= project_input.get('val')
            else:
                for project_input in project_total[key]:
                    if(project_input.get('val') == None):
                        continue
                    if(project_input.get('name') != 'other_interior' and project_input.get('name') != 'road_charges'):
                        fundable_costs += project_input.get('val')
                    project_costs[i] += project_input.get('val')
            project_costs_sum += project_costs[i]
            i += 1
        # Return success if creation is completed.
        return {'status': 'success', 'project_costs': json.dumps(project_costs), 'project_sum': project_costs_sum, 'fundable_sum': fundable_costs, 'offered_purchasing': turnkey}


class IndividualProjectcost(Resource):
    # @auth.login_required
    # @role_required.permission(2)
    def get(self):
        try:
            user_id = request.args.get('user_id')
        except Exception as why:

            # Log the error.
            logging.error(why)

            # Return error.
            return error.INVALID_INPUT_422
        data = IndProjectModel.query.filter_by(user_id=user_id).all()
        # # Create schema for serializing.
        content_schema = IndividualProjectcostSchema(many=True)

        # # Get json data
        project_data = content_schema.dump(data)
        # Get fx and three values i.e)land registry
        additional_data = CalcData.calcForProject(user_id)
        # Return json data from db.
        return {'project_data': project_data, 'additional_data': additional_data}

    def post(self):
        try:
            # get data
            user_id, inputs = request.json.get(
                'user_id'), request.json.get('inputs')
        except Exception as why:
            # Log input strip or etc. errors.
            logging.info("data wrong. " + str(why))
            # Return invalid input error.
            return error.INVALID_INPUT_422
        # check if data exists
        data = IndProjectModel.query.filter_by(user_id=user_id).first()

        # if data exist
        if data is not None:
            # update da
            data.user_id = user_id
            data.housebuilding = json.dumps(inputs.get('housebuilding'))
            data.basement = json.dumps(inputs.get('basement'))
            data.ground = json.dumps(inputs.get('ground'))
            data.exterior = json.dumps(inputs.get('exterior'))
            data.independent = json.dumps(inputs.get('independent'))
            db.session.commit()
        else:
            # Create a new data.
            data = IndProjectModel(user_id=user_id, housebuilding=json.dumps(inputs.get('housebuilding')), basement=json.dumps(inputs.get(
                'basement')), ground=json.dumps(inputs.get('ground')), exterior=json.dumps(inputs.get('exterior')), independent=json.dumps(inputs.get('independent')))
            db.session.add(data)
            db.session.commit()
        return {'status': 'success'}


class IndividualFileupload(Resource):
    # @auth.login_required
    # @role_required.permission(2)
    def allowed_file(self, filename):
        return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

    def post(self):
        if 'file' not in request.files:
            resp = jsonify({'message': 'No file part in the request'})
            resp.status_code = 400
            return resp
        file = request.files['file']
        if file.filename == '':
            resp = jsonify({'message': 'No file selected for uploading'})
            resp.status_code = 400
            return resp
        if file and self.allowed_file(file.filename):
            upload_path = UPLOAD_FOLDER + '/' + \
                request.form['heading'] + '/' + request.form['person']
            file.save(os.path.join(upload_path, file.filename))
            resp = jsonify({'message': 'File successfully uploaded'})
            resp.status_code = 201
            return resp
        else:
            resp = jsonify(
                {'message': 'Allowed file types are txt, pdf, png, jpg, jpeg, gif, doc, docx'})
            resp.status_code = 400
            return resp


class IndividualFileDownload(Resource):
    def get(self):
        filename = request.path
        uploads = os.path.join(app.config['UPLOAD_FOLDER'])
        return send_from_directory(directory=uploads, filename=filename, as_attachment=True)


class IndividualFiledelete(Resource):
    # @auth.login_required
    # @role_required.permission(2)
    def post(self):
        document, heading, person = request.json.get(
            'document'), request.json.get('heading'), request.json.get('person')
        upload_path = UPLOAD_FOLDER + '/' + heading + '/' + person
        os.remove(os.path.join(upload_path, document))
        return 'Deleted file'


class IndividualDocuments(Resource):
    # @auth.login_required
    # @role_required.permission(2)
    def get(self):
        try:
            user_id = request.args.get('user_id')
            documents = IndDocumentsModel.query.filter_by(
                user_id=user_id).all()
            # # Create schema for serializing.
            content_schema = IndividualDocumentsSchema(many=True)

            # # Get json data
            data = content_schema.dump(documents)
            individual_inputs = IndIndividualModel.query.filter_by(
                user_id=user_id).first()
            martial_status = json.loads(individual_inputs.martial_status)[0]
            # Return json data from db.
            return {'documents': data, 'martial_status': martial_status}

        except Exception as why:

            # Log the error.
            logging.error(why)

            # Return error.
            return error.INVALID_INPUT_422

    def post(self):
        try:
            # get data
            user_id, documents = request.json.get(
                'user_id'), request.json.get('documents')
        except Exception as why:
            # Log input strip or etc. errors.
            logging.info("data wrong. " + str(why))
            # Return invalid input error.
            return error.INVALID_INPUT_422
        data = IndDocumentsModel.query.filter_by(user_id=user_id).first()
        # if data exist
        if data is not None:
            # update da
            data.user_id = user_id
            data.identification = json.dumps(documents.get('identification'))
            data.statement_bank = json.dumps(documents.get('statement_bank'))
            data.pay_slip = json.dumps(documents.get('pay_slip'))
            data.proof_assets = json.dumps(documents.get('proof_assets'))
            data.house_offer = json.dumps(documents.get('house_offer'))
            data.basement = json.dumps(documents.get('basement'))
            data.id_guarantor = json.dumps(documents.get('id_guarantor'))
            data.proof_guarantor = json.dumps(documents.get('proof_guarantor'))
            data.deed_suretyship = json.dumps(documents.get('deed_suretyship'))
            db.session.commit()
        else:
            # Create a new data.
            data = IndDocumentsModel(user_id=user_id, identification=json.dumps(documents.get('identification')), statement_bank=json.dumps(documents.get('statement_bank')), pay_slip=json.dumps(documents.get('pay_slip')), proof_assets=json.dumps(documents.get('proof_assets')), house_offer=json.dumps(
                documents.get('house_offer')), basement=json.dumps(documents.get('basement')), id_guarantor=json.dumps(documents.get('id_guarantor')), proof_guarantor=json.dumps(documents.get('proof_guarantor')), deed_suretyship=json.dumps(documents.get('deed_suretyship')))
            db.session.add(data)
            db.session.commit()
        return {'status': 'success'}


class StressScenario(Resource):
    # @auth.login_required
    # @role_required.permission(2)
    def post(self):
        totaladdition = 0
        high = 0
        low = 0
        repaymentrate = 0
        currentYear = date.today().year

        startYear = TimePointParser().parse(request.json.get('startDate')).year
        endYear = TimePointParser().parse(request.json.get('endDate')).year
        yearDiff = endYear - startYear
        stressScenarios = []
        
        try:
            defaultValues = StressScenarioModel.query.first()
            # scSchema = StressScenarioSchema()
            # defaultValues = scSchema.dump(data)
            remainingsp = defaultValues.remainingsp
            remaininghorizon = defaultValues.remaininghorizon
            lendingrate = defaultValues.lendingrate
            sp = defaultValues.sp
            horizon = defaultValues.horizon
            lendingratestress = request.json.get('interest')


            stressScenarioStartValue = remaininghorizon - \
                (startYear - currentYear)
            # get all stressScenarios
            while yearDiff > 0:
                stressScenarios.append(stressScenarioStartValue)
                stressScenarioStartValue -= 1
                yearDiff -= 1

            annuity = round(
                np.pmt((lendingrate / 100), horizon, (sp * - 1)), 2)
            rates = []
            while remaininghorizon >= 0:
                # We need to know, if this is a year with a stress scenario
                # if remaininghorizon == 11 or remaininghorizon == 10 or remaininghorizon == 9 or remaininghorizon == 8:
                if remaininghorizon in stressScenarios:
                    # We need to calculate the new annuity of the stress scenario
                    payedinterestsstress = remainingsp * lendingratestress / 100
                    # What would be paid without the stressful year?
                    payedinterests = remainingsp * lendingrate / 100
                    # Calculate the on top interests of the stressful year
                    payedinterestsadditional = payedinterestsstress - payedinterests
                    # Calculate the new annuity
                    annuitystress = annuity + payedinterestsadditional
                    # Calculate the rate for this year
                    ratestress = annuitystress / 12
                    rates.append(ratestress)
                    # Store the addition in another variable so it doesn´t get lost to sum it up and display it at the end
                    totaladdition = totaladdition + payedinterestsadditional
                    # Calculate the outstanding loan amount and starting point of the next year
                    remainingsp = remainingsp - annuity
                    # Save the first and the last rate of the stress scenario

                    if remaininghorizon == stressScenarios[0]:
                        high = round(ratestress, 2)
                    elif remaininghorizon == stressScenarios[-1]:
                        low = round(ratestress, 2)
                    # If the to be calculated year no stressful year, we can calculate the repayment rate easy
                else:
                    # We calculate the rate of the regular year
                    # If there is no stress scenario, than the repayment rate is always the same
                    repaymentrate = annuity / 12
                    rates.append(repaymentrate)
                    # Calculate the outstanding loan amount and starting point of the next year
                    remainingsp = remainingsp - annuity
                    # Please note: You do not have to calculate this every year, cuz it is not changing, but for the better illustration I inserted it in an if statement
                remaininghorizon = remaininghorizon - 1

            scenario_id = request.json.get('id')
            if(scenario_id == 0):
                scenariodata = UserStressScenarioModel(userId=request.json.get('userId'), startDate=request.json.get('startDate'), endDate=request.json.get(
                    'endDate'), annuity=annuity, rates=json.dumps(rates), high=round(high, 2), low=round(low, 2), interest=lendingratestress, totalAddition=totaladdition)
                db.session.add(scenariodata)
                db.session.flush()
                scenario_id = scenariodata.id
            else:
                scenariodata = UserStressScenarioModel.query.filter_by(id=scenario_id).first()
                scenariodata.startDate = request.json.get('startDate')
                scenariodata.endDate=request.json.get(
                    'endDate')
                scenariodata.annuity=annuity
                scenariodata.rates=json.dumps(rates)
                scenariodata.high=round(high, 2)
                scenariodata.low=round(low, 2) 
                scenariodata.interest=lendingratestress 
                scenariodata.totalAddition=totaladdition
                scenario_id = scenariodata.id
            db.session.commit()
            data = {"scenario_id": scenario_id, "high": round(high, 2), "low": round(low, 2), "repaymentrate": round(repaymentrate, 2), "totaladdition": round(totaladdition, 2), "annuity": annuity, "rates": rates}
            print('calculated data')
            print(data)
            return data
        except Exception as why:
            logging.error(why)
            return error.INVALID_INPUT_422

class stressScenarioDelete(Resource):
    # @auth.login_required
    # @role_required.permission(2)
    def get(self):
        try:
            stressScenarioId = request.args.get('id')
            stressScenario = UserStressScenarioModel.query.filter_by(id=stressScenarioId).first()
            print('stressScenario')
            print(stressScenario)
            # # Add user to session.
            db.session.delete(stressScenario)
            db.session.commit()
            return {'status': 'Deleted!'}

        except Exception as why:

            # Log the error.
            logging.error(why)

            # Return error.
            return error.INVALID_INPUT_422

class UserStressScenario(Resource):
    # @auth.login_required
    # @role_required.permission(2)
    def get(self):
        userId = request.args.get('userId')
        try:
            # get scenario basic data
            stressScenarioData = StressScenarioModel.query.first()
            scSchema = StressScenarioSchema()
            scenarioBasis = scSchema.dump(stressScenarioData)
            # get repayment rate of the regular year
            lendingrate = scenarioBasis.get('lendingrate')
            horizon = scenarioBasis.get('horizon')
            sp =  scenarioBasis.get('sp')
            repaymentregular = round(np.pmt((lendingrate / 100), horizon, (sp * - 1)), 2)/12
            # get old scenarios
            data = UserStressScenarioModel.query.filter_by(
                userId=userId).all()
            print('user data')
            print(data)
            scSchema = UserStressScenarioSchema(many=True)
            oldScenarios = scSchema.dump(data)
    
            return {"remainingsp": scenarioBasis.get('remainingsp'), "remaininghorizon": scenarioBasis.get('remaininghorizon'), "lendingrate": scenarioBasis.get('lendingrate'),  "horizon": scenarioBasis.get('horizon'), "sp": scenarioBasis.get('sp'), "horizon": scenarioBasis.get('horizon'), "repaymentregular": repaymentregular, "oldScenarios": oldScenarios }

        except Exception as why:
            logging.error(why)
            return error.INVALID_INPUT_422


class CalcData(object):
    def format_number(num):
        try:
            dec = decimal.Decimal(num)
        except:
            return 'bad'
        tup = dec.as_tuple()
        delta = len(tup.digits) + tup.exponent
        digits = ''.join(str(d) for d in tup.digits)
        if delta <= 0:
            zeros = abs(tup.exponent) - len(tup.digits)
            val = '0.' + ('0'*zeros) + digits
        else:
            val = digits[:delta] + ('0'*tup.exponent) + '.' + digits[delta:]
        val = val.rstrip('0')
        if val[-1] == '.':
            val = val[:-1]
        if tup.sign:
            return '-' + val
        return val

    def getFx(user_id: int):
        country_id = User.query.filter_by(id=user_id).first().user_country
        country = Country.query.filter_by(id=country_id).first()
        return country.fx

    def convertIndividualToDict(individual_data):
        return {'user_id': individual_data[0].get('user_id'), 'martial_status': json.loads(individual_data[0].get('martial_status')), 'age': json.loads(individual_data[0].get('age')), 'net_income': json.loads(individual_data[0].get('net_income')), 'highest_degree': json.loads(individual_data[0].get('highest_degree')), 'field_work': json.loads(individual_data[0].get('field_work')), 'job_position': json.loads(individual_data[0].get('job_position')), 'kids': json.loads(individual_data[0].get('kids')), 'address': json.loads(individual_data[0].get('address')), 'own_funds': json.loads(individual_data[0].get('own_funds')), 'guarantor': json.loads(individual_data[0].get('guarantor'))}

    def convertIndividual(basis_data, basis_outputs, individual_data):
        basis_self = basis_data[0].get(
            'purchasing') - basis_data[0].get('loan_amount')
        # individual_data[0]['basis_data'] = {'pr': basis_outputs.get('pr'), 'lp': basis_outputs.get('lp'), 'hp': basis_outputs.get('hp'), 'lar': basis_data[0].get('loan_amount'), 'basis_self': basis_self}
        if(len(individual_data) > 0):
            return {'user_id': individual_data[0].get('user_id'), 'martial_status': json.loads(individual_data[0].get('martial_status')), 'age': json.loads(individual_data[0].get('age')), 'net_income': json.loads(individual_data[0].get('net_income')), 'highest_degree': json.loads(individual_data[0].get('highest_degree')), 'field_work': json.loads(individual_data[0].get('field_work')), 'job_position': json.loads(individual_data[0].get('job_position')), 'kids': json.loads(individual_data[0].get('kids')), 'address': json.loads(individual_data[0].get('address')), 'own_funds': json.loads(individual_data[0].get('own_funds')), 'guarantor': json.loads(individual_data[0].get('guarantor')), 'basis_data': {'pr': basis_outputs.get('pr'), 'lp': basis_outputs.get('lp'), 'hp': basis_outputs.get('hp'), 'lar': basis_data[0].get('loan_amount'), 'basis_self': basis_self}}
        else:
            return {'basis_data': {'pr': basis_outputs.get('pr'), 'lp': basis_outputs.get('lp'), 'hp': basis_outputs.get('hp'), 'lar': basis_data[0].get('loan_amount'), 'basis_self': basis_self}}

    def saveIndividual(inputs: dict):
        # get data
        user_id, address, age, field_work, guarantor, highest_degree, job_position, kids, martial_status, net_income, own_funds, pr = inputs.get('user_id'), inputs.get('address'), inputs.get('age'),  inputs.get(
            'field_work'),  inputs.get('guarantor'), inputs.get('highest_degree'), inputs.get('job_position'), inputs.get('kids'), inputs.get('martial_status'), inputs.get('net_income'), inputs.get('own_funds'), inputs.get('pr')
        # check if data exis
        data = IndIndividualModel.query.filter_by(user_id=user_id).first()
        # if data exis
        if data is not None:
            # update da
            data.user_id = user_id
            data.martial_status = json.dumps(martial_status)
            data.age = json.dumps(age)
            data.net_income = json.dumps(net_income)
            data.highest_degree = json.dumps(highest_degree)
            data.field_work = json.dumps(field_work)
            data.job_position = json.dumps(job_position)
            data.kids = json.dumps(kids)
            data.address = json.dumps(address)
            data.own_funds = json.dumps(own_funds)
            data.guarantor = json.dumps(guarantor)
            db.session.commit()
        else:
            # Create a new data.
            data = IndIndividualModel(user_id=user_id, martial_status=json.dumps(martial_status), age=json.dumps(age), net_income=json.dumps(net_income), highest_degree=json.dumps(highest_degree), field_work=json.dumps(
                field_work), job_position=json.dumps(job_position), kids=json.dumps(kids), address=json.dumps(address), own_funds=json.dumps(own_funds), guarantor=json.dumps(guarantor))
            db.session.add(data)
            db.session.commit()

    def saveBasis(inputs: dict):
        user_id, employment_type, interest_variant, loan_amount, loan_term, purchasing, purpose, type_property, preferred_date = inputs.get('user_id'), inputs.get('employment_type'),  inputs.get(
            'interest_variant'),  inputs.get('loan_amount'), inputs.get('loan_term'), inputs.get('purchasing'), inputs.get('purpose'), inputs.get('type_property'), inputs.get('preferred_date')
        purchasing = float(purchasing)
        loan_amount = float(loan_amount)
        loan_term = int(loan_term)
        # check if data exists
        data = IndBasisModel.query.filter_by(user_id=user_id).first()
        # if data exists
        if data is not None:
            # update data
            data.purpose = purpose
            data.type_property = type_property
            data.purchasing = purchasing
            data.loan_amount = loan_amount
            data.interest_variant = interest_variant
            data.loan_term = loan_term
            data.employment_type = employment_type
            data.preferred_date = preferred_date
            db.session.commit()
        else:
            # Create a new data.
            data = IndBasisModel(user_id=user_id, purpose=purpose, type_property=type_property, purchasing=purchasing, loan_amount=loan_amount,
                                 interest_variant=interest_variant, loan_term=loan_term, employment_type=employment_type, preferred_date=preferred_date)
            db.session.add(data)
            db.session.commit()

    def calcBasis(inputs: dict):
        user_id, employment_type, interest_variant, loan_amount, loan_term, purchasing, purpose, type_property, preferred_date = inputs.get('user_id'), inputs.get('employment_type'),  inputs.get(
            'interest_variant'),  inputs.get('loan_amount'), inputs.get('loan_term'), inputs.get('purchasing'), inputs.get('purpose'), inputs.get('type_property'), inputs.get('preferred_date')
        purchasing = float(purchasing)
        loan_amount = float(loan_amount)
        loan_term = int(loan_term)
        # preferred_date = int(preferred_date)
        # check if any countries exist in the country table
        if (Country.query.first() == None or Content.query.first() == None):
            return {'status': 'error', 'msg': 'Sorry. No content provided!'}
        # if user didn't logged in, the country is Austria as default

        if(user_id == 0):
            country = Country.query.first()
        # if user logged in, create or update data
        else:
            country_id = User.query.filter_by(id=user_id).first().user_country
            country = Country.query.filter_by(id=country_id).first()
        # Store calculated interest rates in variable from country DB
        # We need to add them to the calculated interest rate
        ref1 = country.reference_1
        ref2 = country.reference_2
        # Add fixed internal rate to every calculation
        rint = country.country_costs
        # define low end and high end
        l = 40
        h = -40
        # get all contents
        contents = Content.query.all()
        i = 0
        for content in contents:
            # Set variable
            r = 0
            # Check if purpose is acceptey by the content provider
            if(json.loads(content.purpose).get(purpose) == 'not_accepted'):
                continue

            # Check if type of property is acceptey by the content provider
            if(json.loads(content.type_property).get(type_property) == 'not_accepted'):
                continue

            # Check if the minimum or maximum purchasing price is not reached then skip
            content_purchasing_min = content.purchasing_min
            content_purchasing_max = content.purchasing_max
            if(purchasing < content_purchasing_min or purchasing > content_purchasing_max):
                continue

            # Check if the minimum or maximum loan amount rate is not reached then skip
            content_loan_amount_min = content.loan_amount_min
            content_loan_amount_max = content.loan_amount_max
            if(loan_amount < content_loan_amount_min or loan_amount > content_loan_amount_max):
                continue

            # Check if the interest rate variant is not accepted then skip
            if(interest_variant == 'interest_accepted_variable' and content.interest_accepted.name != VariantType['interest_accepted_variable'].name and content.interest_accepted.name != VariantType['interest_accepted_both'].name):
                continue

            # Skip if user wants fixed variant and conten provider accept only variable
            if(interest_variant != 'interest_accepted_variable' and content.interest_accepted == 'interest_accepted_variable'):
                continue
            # Skip if user wants fixed variant and conten provider doesn't accept Xyears
            if(interest_variant != 'interest_accepted_variable' and content.interest_accepted != 'interest_accepted_variable' and json.loads(content.interest_surcharge).get(interest_variant).get('status') == False):
                continue
            # Check if time preferences are not accepted
            content_loan_term_min = content.loan_term_min
            content_loan_term_max = content.loan_term_max
            if(loan_term < content_loan_term_min or loan_term > content_loan_term_max):
                continue
            # Check if this employment type is acceptey by the content provider, otherwise skip
            if(json.loads(content.employment_type).get(employment_type) == 'not_accepted'):
                continue

        # -- Secoundly calculate interest rate
            # If user wants variable, check which reference rate the content provider offers
            # Add internal costs (rint) to each basis interest rate

            if(interest_variant == 'interest_accepted_variable'):
                if(content.interest_reference.name == 'interest_reference_1'):
                    r = ref1 + content.internal_val + rint
                else:
                    r = ref2 + content.internal_val + rint
            # If user wants fixed rates, check the fixed basis plus the surcharge for the amount of yrs
            else:
                r = content.interest_fixed + \
                    json.loads(content.interest_surcharge).get(
                        interest_variant).get('val') + rint
            # Check which reduction or surcharge the content provider offers for purpose
            r += json.loads(content.purpose).get(purpose)
            # Check which reduction or surcharge the content provider offers for this type of property
            r += json.loads(content.type_property).get(type_property)

            # Check if content provider adds any reduction fee for bigger purchasing price
            if(purchasing > content.purchasing_reduction_starting):
                r += content.purchasing_reduction

            # Check if content provider adds any reduction or surchage for employment type
            r += json.loads(content.employment_type).get(employment_type)

            # At least store the calculated interest rates
            # If the new calculated interest rate is higher or lower than previous calculated, than store the new one
            # This is the reason why we need 40 and -40 because it it calculates 1.5 than 1.5 is higher than -40 and less than 40
            if(r < l):
                l = r
            if(r > h):
                h = r

            i = i + 1
            # 'If the user inputs do not match with any content provider, there are still the -40 and 40 values so skip to the end for an error message otherwise go on
        # -- End interation

        if(l == 40 or h == -40):
            return {'status': 'error', 'msg': 'Based on your entries is no calculation possible!'}

        # Display result interest rate
        # Label19.Caption = Round(l, 3) & "%"
        # Label20.Caption = Round(h, 3) & "%"
        borrowing_rate_min = str(round(l, 3)) + "%"
        borrowing_rate_max = str(round(h, 3)) + "%"
        borrowing_rate = json.dumps(
            {'from': str(round(l, 3)) + "%", 'to': str(round(h, 3)) + "%"})
        # Because I recalculate l and h later, but I do need l and h later for displaying, I store them in other variables
        lp = l
        hp = h
        # -- Thirdly Calculate effective interest Rate
        # -- Goal is to calculate the effective interest rate including given external Costs

        #  Main calculation
        # '''At first we calculate the amount for the annuity
        # 'This is the loan amount plus federal taxes based on the puschasing price plus additional external costs

        sp = loan_amount + purchasing * (country.land_register / 100) + (purchasing * country.solvency_rate) * (
            country.right_of_lien / 100) + country.solvency + country.abstract_lr + country.valuation_fee + (purchasing * country.stamp_duty / 100)
        # Calculate annuity to get the lower and higher end of the total amount
        # Inputs are the calculatet interest divided by 100 to get a integer, time horizon an the negative value of the calculated total amount.
        # We get the user has to pay each year
        annl = round(np.pmt((l / 100), loan_term, (sp * -1)), 3)
        annh = round(np.pmt((h / 100), loan_term, (sp * -1)), 3)
        # Because the result is an annual rate we need to multiply with the time horizon to get the total amount
        tal = annl * loan_term
        tah = annh * loan_term
        # 'Calculate real payment rate
        # 'We have to calculate the real payment rate for a secound time because the monthly payment during the year differs from the amount per year (effective)
        prl = round(np.pmt((l / 100) / 12, loan_term * 12, (sp * -1)), 3)
        prh = round(np.pmt((h / 100) / 12, loan_term * 12, (sp * -1)), 3)
        pr = json.dumps({'prl': prl, 'prh': prh})
        # Display result total amount of repay
        total_payment_min = str(round(tal, 2)) + country.fx
        total_payment_max = str(round(tah, 2)) + country.fx
        total_payment = json.dumps(
            {'from': str(round(tal, 2)) + country.fx, 'to': str(round(tah, 2)) + country.fx})
        # Secoundly we have to calculate the effective interest rates or IRR
        # To calculate this, we simulate all the cashflows an compare this with the loan amount
        # It is a simple investment calculation
        # We have to build an array an put the loan amount times (-1) and each cashflow seperatly->this is important to get an annual effective rate

        # Dim arrays and set them to time horizon (it is not easy in vba to dim arrays)
        cashflows_l = [0] * (loan_term + 1)
        cashflows_h = [0] * (loan_term + 1)

        # Add at first the loan amount and multiply by (-1) to set it negative
        cashflows_l[0] = loan_amount * -1
        cashflows_h[0] = loan_amount * -1

        # 'Insert values
        # 'The values are over the whole time horizon constant therefore we store every time the same amount

        for i in range(loan_term + 1):
            if(i != 0):
                cashflows_l[i] = annl
                cashflows_h[i] = annh
        # Calculate the effective interes rate/ internal rate of return (IRR)
        # At first calculate the IRR yearly
        # l = round(np.irr(cashflows_l), 5)
        # h = round(np.irr(cashflows_h), 5)

        # l = np.effect(l/100, 12)
        # h = np.effect(h/100, 12)

        l = pow(1 + l/100/12, 12) - 1
        h = pow(1 + h/100/12, 12) - 1

        # Then calculate the IRR per month
        # The effective interest rate differs as well because of payments during the year
        # effl = (round(pow((l / 12 + 1), 12), 5) - 1) * 100
        # effh = (round(pow((h / 12 + 1), 12), 5) - 1) * 100

        effl = round(l*100, 3)
        effh = round(h*100, 3)

        # 'Display result effective interes rate/ IRR per month
        # effective_interest_rate_min = str(round(effl, 3)) + '%'
        # effective_interest_rate_max = str(round(effh, 3)) + '%'
        effective_rate = json.dumps(
            {'from': str(round(effl, 3)) + '%', 'to': str(round(effh, 3)) + '%'})

        # 'Display results
        payment_rate = json.dumps(
            {'from': str(round(prl, 2)) + country.fx, 'to': str(round(prh, 2)) + country.fx})

        try:
            dec = decimal.Decimal(4.430000)
        except:
            print('bad')
        tup = dec.as_tuple()
        delta = len(tup.digits) + tup.exponent
        digits = ''.join(str(d) for d in tup.digits)
        if delta <= 0:
            zeros = abs(tup.exponent) - len(tup.digits)
            val = '0.' + ('0'*zeros) + digits
        else:
            val = digits[:delta] + ('0'*tup.exponent) + '.' + digits[delta:]
        val = val.rstrip('0')
        if val[-1] == '.':
            val = val[:-1]
        if tup.sign:
            print('-' + val)
        # Change the label font
        info1 = "Ausgehend von Ihren Angaben gehen wir aktuell von einem Nominalzins von " + str(round(lp, 3)) + "%" + " bis " + str(
            round(hp, 3)) + "%" + " aus. Zusätzlich haben wir für die Effektivverzinsung noch folgendes mit einkalkuliert:"
        info2 = "Staatliche Abgaben: Grundbucheintragung von " + str(round(country.land_register, 3)) + "%" + " = " + CalcData.format_number(round(purchasing * country.land_register / 100, 2)) + country.fx + ", Pfandrecht der Bank "+str(
            round(country.right_of_lien, 3))+"% = " + CalcData.format_number(round(purchasing * country.solvency_rate * country.right_of_lien / 100)) + country.fx
        info3 = "Gerforderte Auskünfte der Bank: Bonitätsauskunft " + CalcData.format_number(round(country.solvency, 2)) + country.fx + ", Grundbuchauszüge " + CalcData.format_number(
            round(country.abstract_lr, 2)) + country.fx + ", Schätzgebühr " + CalcData.format_number(round(country.valuation_fee, 2)) + country.fx + ""
        info = json.dumps([info1, info2, info3])

        return {'status': 'success', 'borrowing_rate': borrowing_rate, 'payment_rate': payment_rate, 'effective_rate': effective_rate, 'total_payment': total_payment, 'info': info, 'pr': pr, 'lp': lp, 'hp': hp}

    def calcForProject(user_id: int):
        country_id = User.query.filter_by(id=user_id).first().user_country
        country = Country.query.filter_by(id=country_id).first()
        basis_data = IndBasisModel.query.filter_by(user_id=user_id).first()
        type_property = basis_data.type_property if basis_data is not None else None
        return {'type_property': type_property, 'land_registry': country.land_register, 'land_registry_val':  round(basis_data.purchasing * country.land_register / 100, 2), 'land_bank': country.right_of_lien, 'land_bank_val': round(basis_data.purchasing * country.solvency_rate * (country.right_of_lien / 100), 2), 'stamp_duty_val': round(basis_data.purchasing * country.stamp_duty/100, 2)}

    def calcIndividual(inputs: dict):
        # get data
        user_id, address, age, field_work, guarantor, highest_degree, job_position, kids, martial_status, net_income, own_funds, basis_data = inputs.get('user_id'), inputs.get('address'), inputs.get('age'),  inputs.get(
            'field_work'),  inputs.get('guarantor'), inputs.get('highest_degree'), inputs.get('job_position'), inputs.get('kids'), inputs.get('martial_status'), inputs.get('net_income'), inputs.get('own_funds'), inputs.get('basis_data')
        # basis_obj = json.loads(basis_data)
        lp = basis_data.get('lp')
        hp = basis_data.get('hp')
        lar = basis_data.get('lar')
        # pr = json.loads(basis_data.get('pr'))
        pr = basis_data.get('pr')
        prl = json.loads(pr).get('prl')
        prh = json.loads(pr).get('prh')
        basis_self = basis_data.get('basis_self')
        # age = json.loads(age)
        # check if any countries exist in the country table
        if (Country.query.first() == None or Content.query.first() == None):
            return {'status': 'no database!'}
        # get all contents
        contents = Content.query.all()
        # -------Start calculation
        # Set volume variable to zero
        vol = 0
        # Set variable for calculating attractiveness (3) for each category
        attr = 0
        attr1 = 0
        attr2 = 0
        attr3 = 0
        attr4 = 0
        attr5 = 0
        attr6 = 0
        attr7 = 0
        attr8 = 0
        cp = 0
        for content in contents:
            # At first check K.O. criterias
            # Check if martial status is accepted by content provider
            if(json.loads(content.martial_status).get(martial_status[0]) == 'not_accepted'):
                continue

            # 'Check if age is accepted by content provider
            # 'If the minimum or maximum age is not accepted then skip
            # 'Check if user is a single or if there is another person
            if(martial_status[0] == 'martial_single'):
                if(age[0] < content.age_min or age[0] > content.age_max):
                    continue
            else:
                if(age[0] < content.age_min or age[0] > content.age_max or age[1] < content.age_min or age[1] > content.age_max):
                    continue
            # 'Check if net income is accepted by content provider
            # 'If the minimum or maximum age is not accepted then skip or
            # 'If the (combined) net income of Person 1 + 2 exceeds a given ratio of the average monthly payment rate divided by the net income then skip
            if(martial_status[0] == 'martial_single'):
                # 'Check just single inputs

                if(net_income[0] < content.net_min or (prl+prh)/2/net_income[0] > content.net_not_ratio):
                    continue
            else:
                if((net_income[0] + net_income[1]) < content.net_min or (prl + prh)/2/(net_income[0] + net_income[1])):
                    continue

            # 'Check if highest degree is accepted
            # 'Check if user is a single or if there is another person
            if(martial_status[0] == 'martial_single'):
                # 'Check just single inputs
                if(json.loads(content.highest_degree).get(highest_degree[0]) == 'not_accepted'):
                    continue
            else:
                if(json.loads(content.highest_degree).get(highest_degree[0]) == 'not_accepted' or json.loads(content.highest_degree).get(highest_degree[1]) == 'not_accepted'):
                    continue

            # 'Check if field of work is accepted
            # 'Check if user is a single or if there is another person
            if(martial_status[0] == 'martial_single'):
                # 'Check just single inputs
                if(json.loads(content.field_work).get(field_work[0]) == 'not_accepted'):
                    continue
            else:
                if(json.loads(content.field_work).get(field_work[0]) == 'not_accepted' or json.loads(content.field_work).get(field_work[1]) == 'not_accepted'):
                    continue
            # 'Check if jobposition is accepted

            # 'Check if user is a single or if there is another person
            if(martial_status[0] == 'martial_single'):
                # 'Check just single inputs
                if(json.loads(content.job_position).get(job_position[0]) == 'not_accepted'):
                    continue
            else:
                if(json.loads(content.job_position).get(job_position[0]) == 'not_accepted' or json.loads(content.job_position).get(job_position[1]) == 'not_accepted'):
                    continue

            # 'Check if number of kids is accepted
            if(kids[0] < content.kids_min or kids[0] > content.kids_max):
                continue

            # 'Check if country is accepted
            # 'Check fist if all countries are accepted, if not check if chosen country is accepted
            if(content.address_scope.name == 'individual_countries'):
                countries_db = json.loads(content.country_id)
                if(address.country not in countries_db):
                    continue
            combined_skip = False
            # 'Check if combined (self funding and guarantor) is accepted
            # 'Check if usere selected self funding and guarantor
            # 'Then check if content provider accepts combined or user is below minimum ratio
            if(own_funds.get('accepted') == True and guarantor.get('accepted') == True):
                if(content.combined_required == False or (own_funds.get('sum') + guarantor.get('sum'))/lar < (content.combined_min/100)):
                    continue
                else:
                    # 'If content provider accepts combined and user is above minimum ratio than skip self funding and guarantor check
                    combined_skip = True

            if(not combined_skip):
                # 'Check if self funds are required
                if(own_funds.get('accepted') == False and content.self_required == True):
                    continue
                elif(own_funds.get('accepted')):
                    if(own_funds.get('sum')/lar < (content.self_min/100)):
                        continue

                # 'Check if guarantor is accepted
                if(guarantor.get('accepted') == True and content.guarantor_required == False):
                    continue
                elif(guarantor.get('accepted') == True):
                    if(guarantor.get('sum')/lar < (content.guarantor_min/100)):
                        continue

            # ''''''''''''''''''''''''''''''''''''Secoundly check volume and add it to existing volume
            # 'Because this content provider wasn´t kicked out, we know there is a funding possibility
            # 'We need the volume to check later if the required loan amount is reached and later we will use this to display the attractivness
            vol = vol + content.funding_case_max
            # ''''''''''''''''''''''''''''''''''''Thirdly calculate attractiveness

            # '''''''''''''''Goal is to sum up all reductions and surcharges each category (Martial Status = first category, Age = secound,..) of every content provider

            # 'Set variables (back) to 0 so we do not sum them up (we just want to sum a specivic kinde up).
            attr22 = 0
            attr44 = 0
            attr55 = 0
            attr66 = 0

            # '''Check if martial status gets reduction or surcharge or nothing
            attr1 = attr1 + \
                json.loads(content.martial_status).get(martial_status[0])

            # '''Check if age gets reduction or surcharge or nothing
            # 'Calculate the average reduction/surcharge if there is a person 2
            # 'Check if user is a single or if there is another person
            if(martial_status[0] == 'martial_single'):
                # 'If I would had put more age ranges into the excel, I would check more than 18-25
                if(age[0] > 18 and age[0] < 25):
                    attr2 = attr2 + json.loads(content.age).get('age_18')
            else:
                # if there are 2 persons
                # person 1
                if(age[0] < content.age_min or age[0] > content.age_max):
                    attr22 = attr22 + json.loads(content.age).get('age_18')
                # person 2
                if(age[1] < content.age_min or age[1] > content.age_max):
                    attr22 = attr22 + json.loads(content.age).get('age_18')
                # Both person
                attr2 = attr2 + attr22/2

            # '''Check if net income gets reduction or surcharge or nothing
            # 'This is just one check- the content provider can store more than one ratios f.e. reduction of 0,05% if net income is below 20% or 0,1% if net income is below 10%
            # 'Calc.details: If the average of the calculated payment rate of public1 divided bei the sum of all net income is below the content provider´s ratio then the user gets the reduction
            # 'Please take care that the content provider mayby provides more than one reduction ratio so the user must get the correct reduction ratio but not the (maybe too less reduction ratio) wrong one
            # 'Check if user is a single or if there is another person
            if(martial_status[0] == 'martial_single'):
                # Check just single inputs
                if(net_income[0] < json.loads(content.net)[0].get('ratio')):
                    attr2 = attr3 + json.loads(content.net)[0].reduction
            else:
                if((prl+prh)/2/(net_income[0]+net_income[1]) < json.loads(content.net)[0].get('ratio')):
                    attr3 = attr3 + json.loads(content.net)[0].reduction

            # Check if highest degree gets reduction or surcharge or nothing
            # Check if user is a single or if there is another person
            if(martial_status[0] == 'martial_single'):
                attr4 = attr4 + \
                    json.loads(content.highest_degree).get(highest_degree[0])
            else:
                attr44 = attr44 + \
                    json.loads(content.highest_degree).get(highest_degree[0])
                attr44 = attr44 + \
                    json.loads(content.highest_degree).get(highest_degree[1])
                attr4 = attr4 + attr44 / 2

            # Check if field of work gets reduction or surcharge or nothing
            # Check if user is a single or if there is another person
            if(martial_status[0] == 'martial_single'):
                attr5 = attr5 + \
                    json.loads(content.field_work).get(field_work[0])
            else:
                attr55 = attr55 + \
                    json.loads(content.field_work).get(field_work[0])
                attr55 = attr55 + \
                    json.loads(content.field_work).get(field_work[1])
                attr5 = attr5 + attr55/2

            # Check if job position gets reduction or surcharge or nothing
            # Check if user is a single or if there is another person
            if(martial_status[0] == 'martial_single'):
                attr6 = attr6 + \
                    json.loads(content.job_position).get(job_position[0])
            else:
                attr66 = attr66 + \
                    json.loads(content.job_position).get(job_position[0])
                attr66 = attr66 + \
                    json.loads(content.job_position).get(job_position[1])
                attr6 = attr6 + attr66/2

            # Check if number of kids gets reduction or surcharge or nothing
            # Check how many kids the user has and add
            if(kids[0] == 0):
                action = 'do nothing'
            else:
                temp_key = 'kids_' + str(kids[0])
                attr7 += json.loads(content.kids).get(temp_key)

            # Check if user wants combined self funding + guarantor
            if(own_funds.get('accepted') == True and guarantor.get('accepted') == True):
                if((own_funds.get('sum') + guarantor.sum)/lar >= content.combined_min):
                    attr8 += json.loads(content.combined)[0].reduction
            # If the user just self funds
            elif(own_funds.get('accepted') == True and guarantor.get('accepted') == False):
                # content.self_funds.sort(key)
                self_funds = json.loads(content.self_funds)
                self_funds.sort(key=lambda x: x.get('until'), reverse=True)
                # check which reduction ration fits best. Starting with the highest ratio the content provider offers
                for self_funds_item in self_funds:
                    if(own_funds.get('sum')/lar >= self_funds_item.get('until')):
                        attr8 += self_funds_item.get('reduction')
                        break
                # # If the user do not get the highest ratio, check if secount, third,...
                # elif(own_funds.get('sum')/lar >= json.loads(content.self_funds)[0].get('until')):
                #     attr8+= json.loads(content.self_funds)[0].get('reduction')

            # If the user just self funds
            elif(own_funds.get('accepted') == False and guarantor.get('accepted') == True):
                guarantor = json.loads(content.guarantor)
                guarantor.sort(key=lambda x: x.get('until'), reverse=True)
                # check which reduction ration fits best. Starting with the highest ration the content provider offers
                for guarantor_item in guarantor:
                    if(guarantor.get('sum')/lar >= guarantor_item.get('until')):
                        attr8 += guarantor_item.get('reduction')
                # # If the user do not get the highest ratio, check if secount, third,...
                # elif(guarantor.get('sum')/lar >= json.loads(content.guarantor)[0].get('until')):
                #     attr8+= json.loads(content.guarantor)[0].get('reduction')

            # count how many content provider accept the users profile
            cp += 1
        # end iteration
        general_result = {'msg': '', 'color': '', 'width': ''}
        attractive_result = {'msg': '', 'color': '', 'width': ''}

        # check if there is any content provider left
        if(cp >= 1):
            # ''''''''''''''''''''''''''''''''''''Fourthly calculate final values and display the results
            # 'Calculate the average of all content providers reduction/ surcharges to get the final average
            attr1 = attr1 / cp
            attr2 = attr2 / cp
            attr3 = attr3 / cp
            attr4 = attr4 / cp
            attr5 = attr5 / cp
            attr6 = attr6 / cp
            attr7 = attr7 / cp
            attr8 = attr8 / cp

            # Sum all reductions/ surcharges up to see the total reduction/surcharge
            attr = attr1 + attr2 + attr3 + attr4 + attr5 + attr6 + attr7 + attr8
            print('attr is')
            print(attr)
            print('attr1 is')
            print(attr1)
            print('attr2 is')
            print(attr2)
            print('attr3 is')
            print(attr3)
            print('attr4 is')
            print(attr4)
            print('attr5 is')
            print(attr5)
            print('attr6 is')
            print(attr6)
            print('attr7 is')
            print(attr7)
            print('attr8 is')
            print(attr8)
            # define return vals
            # Compare the calculated reduction/ surplus to the nominal interest rate of public1
            if(attr / ((lp + hp) / 2) > 0.2):
                attractive_result['msg'] = "financing_attractive_sufficient"
                attractive_result['color'] = '#fca103'
                attractive_result['width'] = 100
            elif((attr / ((lp + hp) / 2)) <= 0.2 and (attr / ((lp + hp) / 2)) > -0.2):
                attractive_result['msg'] = "financiing_attractive"
                attractive_result['color'] = '#5c77ff'
                attractive_result['width'] = 100
            elif((attr / ((lp + hp) / 2)) <= -0.2):
                attractive_result['msg'] = "financing_attractive_very"
                attractive_result['color'] = '#78C000'
                attractive_result['width'] = 100
        # ''''''''''''''''''''''''''''''''''''Fourthly display results
        # 'Check if volume goal is achieved
        # 'If every content provider has been skipped than vol = 0 therefore no one is interestet in funding the user-display this message
        # 'If goal is achieved or if criteria are achieved but volume is too small display message
        if(vol < 1):
            general_result['msg'] = "financing_not_enough"
            general_result['color'] = '#fca103'
            general_result['width'] = 10
            # attractive_result['msg'] = "financing_not_enough"
            # attractive_result['color'] = '#f44336'
            # attractive_result['width'] = 10
            # 'If there is no one interested in financing than skip detail calculation
        elif(vol < lar):
            general_result['msg'] = "criteria_ok_but"
            general_result['color'] = '#5c77ff'
            general_result['width'] = 50
        elif(vol >= lar):
            general_result['msg'] = "financing_criteria_good"
            general_result['color'] = '#78C000'
            general_result['width'] = 100
        # if(user_id != 0):
        #     saveIndividual(inputs)
        # return {'status': 'success', 'general_result': json.dumps(general_result), 'attractive_result': json.dumps(attractive_result) }
        return {'status': 'success', 'general_result': general_result['msg'], 'attractive_result': attractive_result['msg']}

    def calcHousehold(inputs):
        household_obj, martial_single, incomes, insurances, expenses, other_expenses, mobility, existing_assets = inputs, inputs.get('martial_single'), inputs.get(
            'income'), inputs.get('insurances'), inputs.get('expenses'),  inputs.get('other_expenses'),  inputs.get('mobility'), inputs.get('existing_assets')
        # Sum income
        sum_income = 0
        for income in incomes:
            if(type(income.get('val')[0]) is int):
                sum_income += income.get('val')[0]
            if(martial_single is False and type(income.get('val')[1]) is int):
                sum_income += income.get('val')[1]
        # Sum expenses
        sum_expenses = 0
        for household in household_obj:
            if(household == 'expenses' or household == 'mobility' or household == 'insurances' or household == 'other_expenses'):
                household_expenses = household_obj.get(household)
                for household_expense in household_expenses:
                    if(type(household_expense.get('val')[0]) is int):
                        sum_expenses += household_expense.get('val')[0]
                    if(martial_single is False and type(household_expense.get('val')[1]) is int):
                        sum_expenses += household_expense.get('val')[1]
        # Freely available income
        freely_available = sum_income - sum_expenses
        # Other assets sum
        sum_other = 0
        for existing_asset in existing_assets:
            if(type(existing_asset.get('val')[0]) is int):
                sum_other += existing_asset.get('val')[0]
            if(martial_single is False and type(existing_asset.get('val')[1]) is int):
                sum_other += existing_asset.get('val')[1]
        # Return success if creation is completed.
        return {'status': 'success', 'sum_income': sum_income, 'sum_expenses': sum_expenses, 'freely_available': freely_available, 'sum_other': sum_other}
