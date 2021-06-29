from flask_appbuilder.models.mongoengine.interface import MongoEngineInterface
from flask_babel import lazy_gettext
from flask_login import current_user
from mongoengine.queryset.visitor import Q


class OtherScenarioMongoEngineInterface(MongoEngineInterface):

    def __init__(self, obj, session=None):
        super(OtherScenarioMongoEngineInterface, self).__init__(obj,session)

    def query(self, filters=None, order_column='', order_direction='',
              page=None, page_size=None):

        # base query : all objects
        objs = self.obj.objects

        # apply filters first if given
        # Q(filters.filters[0]=filters.values[0])|Q(filters.filters[1]=filters.values[1])
        #This filter is used for viewing other scenarios only, excluding current user scenarios
        if current_user.roles[0].name != 'Admin':
            if filters:
                objs = objs.filter(Q(created_by__ne=current_user.id)&Q(process_public=True))
        else:
            if filters:
                objs = objs.filter(Q(created_by__ne=current_user.id))

        if filters:
            objs = filters.apply_all(objs)

        # get the count of all items, either filtered or unfiltered
        count = objs.count()

        # order the data
        if order_column != '':
            if hasattr(getattr(self.obj, order_column), '_col_name'):
                order_column = getattr(getattr(self.obj, order_column), '_col_name')
            if order_direction == 'asc':
                objs = objs.order_by('-{0}'.format(order_column))
            else:
                objs = objs.order_by('+{0}'.format(order_column))

        if page_size is None: # error checking and warnings
            if page is not None:
                log.error('Attempting to get page %s but page_size is undefined' % page)
            if count > 100:
                log.warn('Retrieving %s %s items from DB' % (count, str(self.obj)))
        else: # get data segment for paginated page
            offset = (page or 0) * page_size
            objs = objs[offset : offset + page_size]

        return count, objs

class UserOrPublicMongoEngineInterface(MongoEngineInterface):

    def __init__(self, obj, session=None):
        super(UserOrPublicMongoEngineInterface, self).__init__(obj,session)

    def query(self, filters=None, order_column='', order_direction='',
              page=None, page_size=None):

        # base query : all objects
        objs = self.obj.objects

        # apply filters first if given
        # Q(filters.filters[0]=filters.values[0])|Q(filters.filters[1]=filters.values[1])
        #This filter is used for viewing current user scenarios as well as other scenarios that were made public by other users
        if current_user.roles[0].name != 'Admin':
            if filters:
                objs = objs.filter(Q(created_by=current_user.id)|Q(process_public=True))
        if filters:
            objs = filters.apply_all(objs)

        # get the count of all items, either filtered or unfiltered
        count = objs.count()

        # order the data
        if order_column != '':
            if hasattr(getattr(self.obj, order_column), '_col_name'):
                order_column = getattr(getattr(self.obj, order_column), '_col_name')
            if order_direction == 'asc':
                objs = objs.order_by('-{0}'.format(order_column))
            else:
                objs = objs.order_by('+{0}'.format(order_column))

        if page_size is None: # error checking and warnings
            if page is not None:
                log.error('Attempting to get page %s but page_size is undefined' % page)
            if count > 100:
                log.warn('Retrieving %s %s items from DB' % (count, str(self.obj)))
        else: # get data segment for paginated page
            offset = (page or 0) * page_size
            objs = objs[offset : offset + page_size]

        return count, objs
