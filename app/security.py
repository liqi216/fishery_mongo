import logging
import uuid
from werkzeug.security import generate_password_hash
from flask_appbuilder.security.manager import BaseSecurityManager
from flask_appbuilder.security.mongoengine.manager import SecurityManager

from app.sec_views import *
from app.sec_models import *
from flask_appbuilder import const as c

log = logging.getLogger(__name__)


class MySecurityManager(SecurityManager):
    user_model = User
    userdbmodelview = MyUserDBModelView
    registeruser_model = MyRegisterUser
    registeruserdbview = MyRegisterUserDBView
    authdbview = MyAuthDBView

    def add_register_user(self, username, first_name, last_name, email, affiliation, password='', hashed_password=''):
        """
            Adds a registration request to database
        """
        try:
            register_user = self.registeruser_model()
            register_user.first_name = first_name
            register_user.last_name = last_name
            register_user.username = username
            register_user.email = email
            register_user.affiliation = affiliation
            if hashed_password:
                register_user.password = hashed_password
            else:
                register_user.password = generate_password_hash(password)
            register_user.registration_hash = str(uuid.uuid1())
            register_user.save()
            return register_user
        except Exception as e:
            log.error(c.LOGMSG_ERR_SEC_ADD_REGISTER_USER.format(str(e)))
            return False

    def add_user(self, username, first_name, last_name, email, role, password='', hashed_password='',affiliation=None,):
        """
                Function to create user
        """
        try:
            user = self.user_model()
            user.first_name = first_name
            user.last_name = last_name
            user.username = username
            user.email = email
            user.affiliation = affiliation
            user.active = True
            user.roles.append(role)
            if hashed_password:
                user.password = hashed_password
            else:
                user.password = generate_password_hash(password)
            user.save()
            log.info(c.LOGMSG_INF_SEC_ADD_USER.format(username))
            return user
        except Exception as e:
            log.error(c.LOGMSG_ERR_SEC_ADD_USER.format(str(e)))
            return False

    def find_user_for_reset(self, email):
        if email is None or email == "":
            return None
        user = self.find_user(email=email)
        return user

    #weird error happens sometimes with permission in view, added try catch
    def _has_view_access(self, user, permission_name, view_name):
        roles = user.roles
        for role in roles:
            try:
                permissions = role.permissions
                if permissions:
                    for permission in permissions:
                        if (view_name == permission.view_menu.name) and (permission_name == permission.permission.name):
                            return True
            except Exception as e:
                print("Permission does not exist:")
                print(permission)
        return False

    #weird error happens sometimes with permission in view, added try catch
    def is_item_public(self, permission_name, view_name):
        """
            Check if view has public permissions

            :param permission_name:
                the permission: can_show, can_edit...
            :param view_name:
                the name of the class view (child of BaseView)
        """
        permissions = self.get_public_permissions()
        if permissions:
            try:
                for i in permissions:
                    if (view_name == i.view_menu.name) and (permission_name == i.permission.name):
                        return True
            except Exception as e:
                print("Permission does not exist:")
                print(i)
            return False
        else:
            return False
