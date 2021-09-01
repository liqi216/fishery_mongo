from flask import flash
from flask_appbuilder.views import ModelView
from app.customize.widgets import MyListWidget
from flask_appbuilder.forms import GeneralModelConverter
from flask_appbuilder.widgets import FormWidget
from flask_appbuilder import expose, has_access
from flask_appbuilder.urltools import *
from app.models import *
from copy import deepcopy

class CopyModelView(ModelView):
    copy_form = None
    list_widget = MyListWidget
    copy_title = "Copy Scenario"
    add_title = "Create A Scenario"
    copy_widget = FormWidget
    copy_template = "appbuilder/copy.html"

    def _get_view_widget(self, **kwargs):
        """
         overriding method , used to get search widget for MultipleView
            :return:
                returns widgets dict
        """
        form = self.search_form.refresh()
        widgets = self._get_list_widget(**kwargs)
        return self._get_search_widget(form=form, widgets=widgets)

    @expose('/copy/<pk>', methods=['GET', 'POST'])
    @has_access
    def copy(self, pk):
        pk = self._deserialize_pk_if_composite(pk)
        widgets = self._copy(pk)
        if not widgets:
            return self.post_edit_redirect()
        else:
            return self.render_template(self.copy_template,
                                        title=self.copy_title,
                                        widgets=widgets,
                                        related_views=self._related_views)

    #Adjust name before displaying copy form
    def prefill_copy_form(self, form, pk):
        form.process_name.data = form.process_name.data + " (copy)"

    def _copy(self, pk):
        """
            Copy function logic
        """
        is_valid_form = True
        pages = get_page_args()
        page_sizes = get_page_size_args()
        orders = get_order_args()
        get_filter_args(self._filters)
        exclude_cols = self._filters.get_relation_cols()

        item = self.datamodel.get(pk, self._base_filters)
        if not item:
            abort(404)
        # convert pk to correct type, if pk is non string type.
        pk = self.datamodel.get_pk_value(item)

        if request.method == 'POST':
            form = self.copy_form.refresh(request.form)
            # fill the form with the suppressed cols, generated from exclude_cols
            self._fill_form_exclude_cols(exclude_cols, form)

            form._id = pk
            successful_pre_add = True
            if form.validate():
                self.process_form(form, False)
                new_item = self.datamodel.obj()
                new_item.simple_scenario = item.simple_scenario
                form.populate_obj(new_item)

                try:
                    self.pre_add(new_item)
                    print(new_item)
                except Exception as e:
                    flash(str(e), "danger")
                    successful_pre_add = False
                else:
                    self.datamodel.add(new_item)
                    #set up pgi copy
                    pgi = ProcessGenInput.objects(process_id=pk).first()
                    new_pgi = deepcopy(pgi)
                    new_pgi.id = None
                    new_pgi.process_id = new_item.id

                    new_pgi.save()

                    #set up mse result copy, if there exists one for the given pgi
                    mseResult = MseResultList.objects(process_gen_id=str(pgi.id)).first()
                    if mseResult != None:
                        print(mseResult)
                        new_mseResult = deepcopy(mseResult)
                        new_mseResult.id = None
                        new_mseResult.process_gen_id = str(new_pgi.id)
                        new_mseResult.save()

                    flash(*self.datamodel.message)
                finally:
                    if successful_pre_add == False:
                        widgets = self._get_copy_widget(form=form, exclude_cols=exclude_cols)
                        widgets = self._get_related_views_widgets(item, filters={},
                                                                  orders=orders, pages=pages, page_sizes=page_sizes, widgets=widgets)
                        return widgets
                    return None
            else:
                is_valid_form = False
        else:
            # Only force form refresh for select cascade events
            form = self.copy_form.refresh(obj=item)
            # Perform additional actions to pre-fill the edit form.
            self.prefill_copy_form(form, pk)

        widgets = self._get_copy_widget(form=form, exclude_cols=exclude_cols)
        widgets = self._get_related_views_widgets(item, filters={},
                                                  orders=orders, pages=pages, page_sizes=page_sizes, widgets=widgets)
        if is_valid_form:
            self.update_redirect()
        return widgets

    def _add(self):
        """
            Overriding this to include unique scenario name error within form, without redirect
        """
        is_valid_form = True
        get_filter_args(self._filters)
        exclude_cols = self._filters.get_relation_cols()
        form = self.add_form.refresh()

        if request.method == 'POST':
            self._fill_form_exclude_cols(exclude_cols, form)
            successful_pre_add = True
            if form.validate():
                print("add")
                self.process_form(form, True)
                item = self.datamodel.obj()
                form.populate_obj(item)

                try:
                    self.pre_add(item)
                except Exception as e:
                    flash(str(e), "danger")
                    successful_pre_add = False
                else:
                    if self.datamodel.add(item):
                        self.post_add(item)
                    flash(*self.datamodel.message)
                finally:
                    if successful_pre_add == False:
                        return self._get_add_widget(form=form, exclude_cols=exclude_cols)
                    return None
            else:
                is_valid_form = False
        if is_valid_form:
            self.update_redirect()
        return self._get_add_widget(form=form, exclude_cols=exclude_cols)

    def _edit(self, pk):
        """
            Overriding this to include unique scenario name error within form, without redirect
        """
        is_valid_form = True
        pages = get_page_args()
        page_sizes = get_page_size_args()
        orders = get_order_args()
        get_filter_args(self._filters)
        exclude_cols = self._filters.get_relation_cols()

        item = self.datamodel.get(pk, self._base_filters)
        if not item:
            abort(404)
        # convert pk to correct type, if pk is non string type.
        pk = self.datamodel.get_pk_value(item)

        if request.method == 'POST':
            form = self.edit_form.refresh(request.form)
            # fill the form with the suppressed cols, generated from exclude_cols
            self._fill_form_exclude_cols(exclude_cols, form)
            # trick to pass unique validation
            form._id = pk
            successful_pre_update = True
            if form.validate():
                self.process_form(form, False)
                form.populate_obj(item)
                try:
                    self.pre_update(item)
                except Exception as e:
                    flash(str(e), "danger")
                    successful_pre_update = False
                else:
                    if self.datamodel.edit(item):
                        self.post_update(item)
                    flash(*self.datamodel.message)
                finally:
                    if successful_pre_update == False:
                        widgets = self._get_edit_widget(form=form, exclude_cols=exclude_cols)
                        widgets = self._get_related_views_widgets(item, filters={},
                                                                  orders=orders, pages=pages, page_sizes=page_sizes, widgets=widgets)
                        return widgets
                    return None
            else:
                is_valid_form = False
        else:
            # Only force form refresh for select cascade events
            form = self.edit_form.refresh(obj=item)
            # Perform additional actions to pre-fill the edit form.
            self.prefill_form(form, pk)

        widgets = self._get_edit_widget(form=form, exclude_cols=exclude_cols)
        widgets = self._get_related_views_widgets(item, filters={},
                                                  orders=orders, pages=pages, page_sizes=page_sizes, widgets=widgets)
        if is_valid_form:
            self.update_redirect()
        return widgets

    def _init_forms(self):
        """
            Overriding to include copy form
        """
        super(CopyModelView, self)._init_forms()
        conv = GeneralModelConverter(self.datamodel)
        if not self.add_form:
            self.add_form = conv.create_form(self.label_columns,
                                             self.add_columns,
                                             self.description_columns,
                                             self.validators_columns,
                                             self.add_form_extra_fields,
                                             self.add_form_query_rel_fields)
        if not self.edit_form:
            self.edit_form = conv.create_form(self.label_columns,
                                              self.edit_columns,
                                              self.description_columns,
                                              self.validators_columns,
                                              self.edit_form_extra_fields,
                                              self.edit_form_query_rel_fields)
        if not self.copy_form:
            self.copy_form = conv.create_form(self.label_columns,
                                              self.edit_columns,
                                              self.description_columns,
                                              self.validators_columns,
                                              self.edit_form_extra_fields,
                                              self.edit_form_query_rel_fields)

    def _get_copy_widget(self, form, exclude_cols=None, widgets=None):
        exclude_cols = exclude_cols or []
        widgets = widgets or {}
        widgets['copy'] = self.copy_widget(form=form,
                                           include_cols=self.edit_columns,
                                           exclude_cols=exclude_cols,
                                           fieldsets=self.edit_fieldsets
        )
        return widgets
