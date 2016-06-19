     app.directive('selectTwoAjax', ['$parse','$timeout', function ($timeout,$parse,$scope,$rootScope) {
            return {
               restrict: 'A',
                    scope: {
                    modelValue: '@ngModel'
                  },
               link: function(scope, element, attrs,rootScope) {

                if(!!attrs.create){
                }else{
                  attrs.create=false;
                }
                var selectizes = $(element).selectize({
                    valueField: 'id',
                    labelField: attrs.key,
                    searchField: attrs.key,
                    placeholder:attrs.placeholder,
                    create: attrs.create,
                    onOptionAdd:function(a,item,talvez){

                      if(attrs.create){
                        if(item.name==item.id){
                          var name=item.name;
                          var selectize = selectizes[0].selectize;
                          $.post( scope.$root.url+"/tags", { name: ""+name},function(resp){
                                selectize.removeOption(name);
                                selectize.refreshOptions();
                                selectize.addOption({name:resp.data.name,id:resp.data.id});
                                selectize.addItems(resp.data.id);
                                selectize.refreshOptions();

                          } );
                        }
 
                      }
                    },
                    render: {
                        option: function(item, escape) {
                          var name=eval("item."+attrs.key);
                            return '<div>' +
                                '<span class="title">' +
                                    '<span class="name">' + escape(name) + '</span>' +
                                '</span><br>' +
                            '</div>';
                        }
                    },
                    load: function(query, callback) {
                        if (!query.length) return callback();
                        $.ajax({
                            url: scope.$root.url+'/'+attrs.modelname+'?where={"'+attrs.key+'":{"contains":"'+encodeURIComponent(query)+'"}}&rand='+Math.random(),
                            type: 'GET',
                            error: function() {
                                callback();
                            },
                            success: function(res) {
                              callback(res.data.slice(0, 10));
                            }
                        });
                    }
                });

                console.log(attrs.model);
                attrs.$observe("model", function (newValue) {
                    if(!!newValue){
                      setTimeout(function(){
                        try {
                          var  jsonValue=angular.fromJson(newValue);
                          var selectize = selectizes[0].selectize;


                          if(Object.prototype.toString.call(jsonValue) === '[object Array]'){
                            var options=[];
                            var idOptions=[];
                            for (var i = 0; i < jsonValue.length; i++) {
                              var option={id: jsonValue[i].id};
                              var name=eval("jsonValue[i]."+attrs.key);
                              option[attrs.key]=name;
                              options.push(option);
                              idOptions.push(jsonValue[i].id);
                            }
                            selectize.addOption(options);
                            selectize.addItems(idOptions);
                          }else{
                            var options={id: jsonValue.id};
                            var name=eval("jsonValue."+attrs.key);
                            options[attrs.key]=name;
                            selectize.addOption(options);
                            selectize.addItem(jsonValue.id);
                          }

                        } catch (e) {
                            console.log(e);
                        }
                      
                      }, 500);
                    }
                  });
               }                    

            };
         }]);
