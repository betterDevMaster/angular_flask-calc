import logging
import json
from datetime import datetime
from flask import g, request
from flask_restful import Resource
import api.error.errors as error
from api.conf.auth import auth, refresh_jwt
from api.database.database import db
from api.models.models import ContentName, Content
from api.schemas.schemas import ContentNameSchema, ContentSchema, ContentSurchargeSchema, ContentReductionSchema, ContentRangeSchema, ContentGuarantorSchema
from flask import jsonify


# Content names
class ContentNameAll(Resource):
    # @auth.login_required
    # @role_required.permission(2)
    def get(self):
        try:
            content_names = ContentName.query.all()
            
            # Create user schema for serializing.
            content_name_schema = ContentNameSchema(many=True)
            # Get json data
            data = content_name_schema.dump(content_names)
            # Return json data from db.
            return data

        except Exception as why:

            # Log the error.
            logging.error(why)

            # Return error.
            return error.INVALID_INPUT_422

# Content names
class ContentVariety(Resource):
    # @auth.login_required
    # @role_required.permission(2)
    def get(self):
        try:
            page = request.args.get('page')
            content_names = ContentName.query.filter_by(page=page).all()
            # Create user schema for serializing.
            content_name_schema = ContentNameSchema(many=True)
            # Get json data
            data = content_name_schema.dump(content_names)
            #db.session.close()
            # Return json data from db.
            return data

        except Exception as why:

            # Log the error.
            logging.error(why)

            # Return error.
            return error.INVALID_INPUT_422

class ContentMains(Resource):
    # @auth.login_required
    # @role_required.permission(2)
    def get(self):
        try:
            user_id = request.args.get('user_id')
            content = Content.query.filter_by(user_id=user_id).all()
            print('content')
            print(content)
            # Create user schema for serializing.
            content_schema = ContentSchema(many=True)

            # Get json data
            data = content_schema.dump(content)
            #db.session.close()
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
            logging.info("data wrong. " + str(why))
            # Return invalid input error.
            return error.INVALID_INPUT_422
        request_data = request.json
        # check if content exists
        data = Content.query.filter_by(user_id=request_data.get('user_id')).first()
        # if content exists.
        if data is not None:
            print('start update')
            # Update data
            data.user_id=request_data.get('user_id') 
            data.interest_accepted=request_data.get('interest_accepted') 
            data.interest_reference=request_data.get('interest_reference') 
            data.interest_fixed=request_data.get('interest_fixed') 
            data.interest_surcharge=request_data.get('interest_surcharge') 
            data.internal_val=request_data.get('internal_val') 
            data.funding_case_min=request_data.get('funding_case_min') 
            data.funding_case_max=request_data.get('funding_case_max') 
            data.purpose=request_data.get('purpose') 
            data.type_property=request_data.get('type_property') 
            data.purchasing_min=request_data.get('purchasing_min') 
            data.purchasing_max=request_data.get('purchasing_max') 
            data.purchasing_reduction_starting=request_data.get('purchasing_reduction_starting')
            data.purchasing_reduction=request_data.get('purchasing_reduction') 
            data.loan_amount_min=request_data.get('loan_amount_min') 
            data.loan_amount_max=request_data.get('loan_amount_max') 
            data.loan_term_min=request_data.get('loan_term_min') 
            data.loan_term_max=request_data.get('loan_term_max') 
            data.employment_type=request_data.get('employment_type') 
            data.martial_status=request_data.get('martial_status') 
            data.age_min=request_data.get('age_min') 
            data.age_max=request_data.get('age_max') 
            data.age=request_data.get('age') 
            data.net_min=request_data.get('net_min') 
            data.net_not_ratio=request_data.get('net_not_ratio') 
            data.net=request_data.get('net') 
            data.highest_degree=request_data.get('highest_degree') 
            data.field_work=request_data.get('field_work') 
            data.job_position=request_data.get('job_position') 
            data.kids_min=request_data.get('kids_min') 
            data.kids_max=request_data.get('kids_max') 
            data.kids=request_data.get('kids') 
            data.address_scope=request_data.get('address_scope') 
            data.country_id=request_data.get('country_id') 
            data.self_required=request_data.get('self_required') 
            data.self_min=request_data.get('self_min') 
            data.self_funds=request_data.get('self_funds') 
            data.guarantor_required=request_data.get('guarantor_required') 
            data.guarantor_min=request_data.get('guarantor_min') 
            data.guarantor=request_data.get('guarantor') 
            data.combined_required=request_data.get('combined_required') 
            data.combined_min=request_data.get('combined_min') 
            data.combined=request_data.get('combined')
            db.session.commit()
            return {'status': 'Updated'}
        else:
            # Create a new data.
            data = Content(user_id=request_data.get('user_id'), interest_accepted=request_data.get('interest_accepted'), interest_reference=request_data.get('interest_reference'), interest_fixed=request_data.get('interest_fixed'), interest_surcharge=request_data.get('interest_surcharge'), internal_val=request_data.get('internal_val'), funding_case_min=request_data.get('funding_case_min'), funding_case_max=request_data.get('funding_case_max'), purpose=request_data.get('purpose'), type_property=request_data.get('type_property'), purchasing_min=request_data.get('purchasing_min'), purchasing_max=request_data.get('purchasing_max'), purchasing_reduction_starting=request_data.get('purchasing_reduction_starting'), purchasing_reduction=request_data.get('purchasing_reduction'), loan_amount_min=request_data.get('loan_amount_min'), loan_amount_max=request_data.get('loan_amount_max'), loan_term_min=request_data.get('loan_term_min'), loan_term_max=request_data.get('loan_term_max'), employment_type=request_data.get('employment_type'), martial_status=request_data.get('martial_status'), age_min=request_data.get('age_min'), age_max=request_data.get('age_max'), age=request_data.get('age'), net_min=request_data.get('net_min'), net_not_ratio=request_data.get('net_not_ratio'), net=request_data.get('net'), highest_degree=request_data.get('highest_degree'), field_work=request_data.get('field_work'), job_position=request_data.get('job_position'), kids_min=request_data.get('kids_min'), kids_max=request_data.get('kids_max'), kids=request_data.get('kids'), address_scope=request_data.get('address_scope'), country_id=request_data.get('country_id'), self_required=request_data.get('self_required'), self_min=request_data.get('self_min'), self_funds=request_data.get('self_funds'), guarantor_required=request_data.get('guarantor_required'), guarantor_min=request_data.get('guarantor_min'), guarantor=request_data.get('guarantor'), combined_required=request_data.get('combined_required'), combined_min=request_data.get('combined_min'), combined=request_data.get('combined'))
            db.session.add(data)
            db.session.commit()
            return {'status': 'Created'}


class ContentSurcharges(Resource):
    # @auth.login_required
    # @role_required.permission(2)
    def get(self):
        try:
            user_id = request.args.get('user_id')
            content = ContentSurcharge.query.filter_by(user_id=user_id).all()
            
            # Create schema for serializing.
            content_schema = ContentSurchargeSchema(many=True)

            # Get json data
            data = content_schema.dump(content)
            #db.session.close()
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
            user_id, name, status, val = request.json.get('user_id'), request.json.get('name'), request.json.get('status'), request.json.get('val')
        except Exception as why:
            logging.info("data wrong. " + str(why))
            # Return invalid input error.
            return error.INVALID_INPUT_422
        # check if data exists
        changedFlag = False
        data = ContentSurcharge.query.filter_by(user_id=user_id, name=name).first()
        # if data exists.
        if data is not None:
            # return error.ALREADY_EXIST
            if(data.status != status):
                changedFlag = True
                data.status = status
            if(data.val != val):
                changedFlag = True
                data.val = val
            if(changedFlag == True):
                db.session.commit()
            # Return success if update is completed.
            return {'status': 'updated'}
        else:
            # Create a new data.
            data = ContentSurcharge(user_id=user_id, name=name, status=status, val=val)
            # Add user to session.
            db.session.add(data)
            # Commit session.
            db.session.commit()

            # Return success if creation is completed.
            return {'status': 'created'}

class ContentReductions(Resource):
    # @auth.login_required
    # @role_required.permission(2)
    def get(self):
        try:
            user_id = request.args.get('user_id')
            content = ContentReduction.query.filter_by(user_id=user_id).all()
            
            # Create schema for serializing.
            content_schema = ContentReductionSchema(many=True)

            # Get json data
            data = content_schema.dump(content)
            #db.session.close()
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
            user_id, name, val = request.json.get('user_id'), request.json.get('name'), request.json.get('val')
        except Exception as why:
            logging.info("data wrong. " + str(why))
            # Return invalid input error.
            return error.INVALID_INPUT_422
        # check if data exists
        data = ContentReduction.query.filter_by(user_id=user_id, name=name).first()
        # if data exists.
        if data is not None:
            # return error.ALREADY_EXIST
            if(data.val != val):
                data.val = val
                db.session.commit()
            # Return success if update is completed.
            return {'status': 'updated'}
        else:
            # Create a new data.
            data = ContentReduction(user_id=user_id, name=name, val=val)
            # Add user to session.
            db.session.add(data)
            db.session.commit()

            # Return success if creation is completed.
            return {'status': 'created'}

class ContentRanges(Resource):
    # @auth.login_required
    # @role_required.permission(2)
    def get(self):
        try:
            user_id = request.args.get('user_id')
            content = ContentRange.query.filter_by(user_id=user_id).all()
            
            # Create schema for serializing.
            content_schema = ContentRangeSchema(many=True)

            # Get json data
            data = content_schema.dump(content)
            #db.session.close()
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
            user_id, name, val = request.json.get('user_id'), request.json.get('name'), request.json.get('val')
        except Exception as why:
            logging.info("data wrong. " + str(why))
            # Return invalid input error.
            return error.INVALID_INPUT_422
        # check if data exists
        data = ContentRange.query.filter_by(user_id=user_id, name=name).first()
        # if data exists.
        if data is not None:
            # return error.ALREADY_EXIST
            if(data.val != val):
                data.val = val
                db.session.commit()
            # Return success if update is completed.
            return {'status': 'updated'}
        else:
            # Create a new data.
            data = ContentRange(user_id=user_id, name=name, val=val)
            # Add user to session.
            db.session.add(data)
            # Commit session.
            db.session.commit()

            # Return success if creation is completed.
            return {'status': 'created'}

class ContentGuarantors(Resource):
    # @auth.login_required
    # @role_required.permission(2)
    def get(self):
        try:
            user_id = request.args.get('user_id')
            content = ContentGuarantor.query.filter_by(user_id=user_id).all()
            
            # Create schema for serializing.
            content_schema = ContentGuarantorSchema(many=True)

            # Get json data
            data = content_schema.dump(content)
            #db.session.close()
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
            user_id, name, required, mini, until_1, reduction_1, until_2, reduction_2, until_3, reduction_3, until_4, reduction_4, until_5, reduction_5, reduction_to = request.json.get('user_id'), request.json.get('name'), request.json.get('required'), request.json.get('mini'), request.json.get('until_1'), request.json.get('reduction_1'), request.json.get('until_2'), request.json.get('reduction_2'), request.json.get('until_3'), request.json.get('reduction_3'), request.json.get('until_4'), request.json.get('reduction_4'), request.json.get('until_5'), request.json.get('reduction_5'), request.json.get('reduction_to')
        except Exception as why:
            logging.info("data wrong. " + str(why))
            # Return invalid input error.
            return error.INVALID_INPUT_422
        # check if data exists
        data = ContentGuarantor.query.filter_by(user_id=user_id, name=name).first()
        # if data exists.
        if data is not None:
            # return error.ALREADY_EXIST
            changedFlag = False
            if(data.required != required):
                changedFlag = True
                data.required = required
            if(data.mini != mini):
                changedFlag = True
                data.mini = mini
            
            if(data.until_1 != until_1):
                changedFlag = True
                data.until_1 = until_1
            if(data.reduction_1 != reduction_1):
                changedFlag = True
                data.reduction_1 = reduction_1
            
            if(data.until_2 != until_2):
                changedFlag = True
                data.until_2 = until_2
            if(data.reduction_2 != reduction_2):
                changedFlag = True
                data.reduction_2 = reduction_2
            
            if(data.until_3 != until_3):
                changedFlag = True
                data.until_3 = until_3
            if(data.reduction_3 != reduction_3):
                changedFlag = True
                data.reduction_3 = reduction_3
            
            if(data.until_4 != until_4):
                changedFlag = True
                data.until_4 = until_4
            if(data.reduction_4 != reduction_4):
                changedFlag = True
                data.reduction_4 = reduction_4
            
            if(data.until_5 != until_5):
                changedFlag = True
                data.until_5 = until_5
            if(data.reduction_5 != reduction_5):
                changedFlag = True
                data.reduction_5 = reduction_5
                
            if(data.reduction_to != reduction_to):
                changedFlag = True
                data.reduction_to = reduction_to

            if(changedFlag == True):
                db.session.commit()
            # Return success if update is completed.
            return {'status': 'updated'}
        else:
            # Create a new data.
            data = ContentGuarantor(user_id=user_id, name=name, required=required, mini=mini, until_1=until_1, reduction_1=reduction_1, until_2=until_2, reduction_2=reduction_2, until_3=until_3, reduction_3=reduction_3, until_4=until_4, reduction_4=reduction_4, until_5=until_5, reduction_5=reduction_5, reduction_to=reduction_to)
            print(data)
            # Add user to session.
            db.session.add(data)
            # Commit session.
            db.session.commit()

            # Return success if creation is completed.
            return {'status': 'created'}