/* 
arunes.crmjslib v1.1.0
last update: 2013-06-03 16:27 +2 GMT
*/

// class and constructor
function arunesCrmJsLib() {
    // defines jquery ajax calls async or sync
    this.async = true;

    var _console = window.console;
    var consoleActive = "console" in window && typeof console != "undefined";
    window.console = {
        log: function (msg) { if (consoleActive) _console.log(msg); },
        debug: function (msg) { if (consoleActive) { if (typeof _console.debug != "undefined") { _console.debug(msg); } else { _console.log(msg); } } },
        info: function (msg) { if (consoleActive) { if (typeof _console.info != "undefined") { _console.info(msg); } else { _console.log(msg); } } },
        warn: function (msg) { if (consoleActive) { if (typeof _console.warn != "undefined") { _console.warn(msg); } else { _console.log(msg); } } },
        error: function (msg) { if (consoleActive) { if (typeof _console.error != "undefined") { _console.error(msg); } else { _console.log(msg); } } }
    };

    // if content in iframe
    if (typeof Xrm === 'undefined' || Xrm.Page.getAttribute == undefined)
        Xrm = parent.Xrm;

    // check Xrm 
    if (Xrm === 'undefined') {
        throw { name: "XrmError", message: "Xrm page context cannot be found, please include ClientGlobalContext or execute this page as a webresource / iframe" };
        console.error("Xrm page context cannot be found, please include ClientGlobalContext or execute this page as a webresource / iframe");
    } else {
        console.info("Xrm page context loaded successfully.");
    }

    // get elm. value
    this.getValue = function (elmId) {
        try {
            console.log("Getting value of '" + elmId + "'.");
            return Xrm.Page.getAttribute(elmId).getValue();
        } catch (e) {
            console.warn("Getting value of '" + elmId + "' failed!");
            console.debug(e);
            return null;
        }
    };

    // get current form's guid
    this.getCurrentId = function () {
        try {
            console.log("Getting id of current entity.");
            return Xrm.Page.data.entity.getId();
        } catch (e) {
            console.warn("Getting id of current entity failed!");
            console.debug(e);
            return null;
        }
    };

    // get current user id
    this.getUserId = function () {
        try {
            console.log("Getting id of current user.");
            return Xrm.Page.context.getUserId();
        } catch (e) {
            console.warn("Getting id of current user failed!");
            console.debug(e);
            return null;
        }
    };

    // get current entity name
    this.getEntityName = function () {
        try {
            console.log("Getting name of current entity.");
            return Xrm.Page.data.entity.getEntityName();
        } catch (e) {
            console.warn("Getting name of current entity failed!");
            console.debug(e);
            return null;
        }
    };

    // get submit mode
    this.getSubmitMode = function (elmId) {
        try {
            console.log("Getting submit mode of '" + elmId + "'.");
            return Xrm.Page.getAttribute(elmId).getSubmitMode();
        } catch (e) {
            console.warn("Getting submit mode of '" + elmId + "' failed!");
            console.debug(e);
            return null;
        }
    };

    // get if value has changed
    this.isValueChanged = function (elmId) {
        try {
            console.log("Getting is dirty mode of '" + elmId + "'.");
            return Xrm.Page.getAttribute(elmId).getIsDirty();
        } catch (e) {
            console.warn("Getting is dirty mode of '" + elmId + "' failed!");
            console.debug(e);
            return false;
        }
    };

    // get elm. text (for picklists, lookups)
    this.getText = function (elmId) {
        try {
            console.log("Getting text of '" + elmId + "'.");
            var obj = Xrm.Page.ui.controls.get(elmId);
            if (obj != null) {
                switch (obj.getControlType()) {
                    case 'lookup':
                        var val = this.getValue(elmId);
                        if (val != null) return val[0].name;
                        break;
                    case 'optionset': return Xrm.Page.getAttribute(elmId).getText();
                    default: console.warn("'" + elmId + "' element is should be lookup or optionset to get text!"); return null;
                }
            } else {
                console.warn("'" + elmId + "' element not found!");
            }
            return null;
        } catch (e) {
            console.warn("Getting text of '" + elmId + "' failed!");
            console.debug(e);
            return null;
        }
    };

    // get web resource script async
    this.getWRScript = function (webResource, callback) {
        if (jQuery) {
            webResource = "/" + ORG_UNIQUE_NAME + "/WebResources/" + webResource;
            console.info("Loading webresource '" + webResource + "'.");
            $.getScript(webResource, function () {
                console.info("'" + webResource + "' loaded successfully!");
                if (typeof callback == "function")
                    callback();
            });
        } else {
            console.warn("getWRScript function needs jQuery library to execute. Please include jQuery.");
        }
    };

    // set elm. value
    this.setValue = function (elmId, val) {
        try {
            console.log("Setting value '" + val + "' to '" + elmId + "'.");
            Xrm.Page.getAttribute(elmId).setValue(val);
        } catch (e) {
            console.warn("Setting value '" + val + "' to '" + elmId + "' is failed!");
            console.debug(e);
        }
    };

    // set lookup value
    this.setLookupValue = function (elmId, id, name, type) {
        console.log("Setting lookup value (id: '" + id + "', name: '" + name + "', type: '" + type + "') to '" + elmId + "'");
        var lookupValue = new Array();
        lookupValue[0] = new Object();
        lookupValue[0].id = id;
        lookupValue[0].name = name;
        lookupValue[0].entityType = type;
        this.setValue(elmId, lookupValue);
    };

    // set elm. disable
    this.setDisabled = function (elmId, disable) {
        try {
            console.log("Setting disabled '" + disable + "' to '" + elmId + "'.");
            Xrm.Page.ui.controls.get(elmId).setDisabled(disable);
        } catch (e) {
            console.warn("Setting disabled '" + disable + "' to '" + elmId + "' is failed!");
            console.debug(e);
        }
    };

    // set elm. visibility
    this.setVisible = function (elmId, visible) {
        try {
            console.log("Setting visible '" + visible + "' to '" + elmId + "'.");
            Xrm.Page.ui.controls.get(elmId).setVisible(visible);
        } catch (e) {
            console.warn("Setting visible '" + visible + "' to '" + elmId + "' is failed!");
            console.debug(e);
        }
    };

    // set tab/section visibility
    this.setVisibleTabSection = function (tabname, sectionname, show) {
        try {
            var tab = Xrm.Page.ui.tabs.get(tabname);
            if (tab != null) {
                if (sectionname == null) {
                    console.log("Changing visibility to '" + visible + "' of tab '" + tabname + "'.");
                    tab.setVisible(show);
                } else {
                    var section = tab.sections.get(sectionname);
                    if (section != null) {
                        console.log("Changing visibility to '" + visible + "' of section '" + sectionname + "'.");
                        section.setVisible(show);
                        if (show) tab.setVisible(show);
                    } else {
                        console.warn("'" + section + "' section could not be found!");
                    }
                }
            } else {
                console.warn("'" + tabname + "' tab could not be found!");
            }
        } catch (e) {
            console.warn("Changing visibility of tab '" + tabname + "' or section '" + sectionname + "' to '" + show + "' is failed!");
            console.debug(e);
        }
    };

    // get control
    this.getControl = function (elmId) {
        try {
            console.log("Getting control '" + elmId + "'.");
            return Xrm.Page.getControl(elmId);
        } catch (e) {
            console.warn("Getting control '" + elmId + "' is failed!");
            console.debug(e);
            return null;
        }
    };

    // set frame url
    this.setFrameUrl = function (elmId, url) {
        try {
            console.log("Setting url '" + url + "' for frame '" + elmId + "'.");
            this.getControl(elmId).setSrc(url);
        } catch (e) {
            console.warn("Setting url '" + url + "' for frame '" + elmId + "' is failed!");
            console.debug(e);
        }
    };

    // reload frame
    this.reloadFrame = function (elmId) {
        try {
            console.log("Reloading frame '" + elmId + "'.");
            this.setFrameUrl(elmId, this.getControl(elmId).getSrc());
        } catch (e) {
            console.warn("Reloading frame '" + elmId + "' is failed!");
            console.debug(e);
        }
    };

    // add or replace parameter value of querystring
    this.addValueToQueryString = function (key, value, queryString) {
        try {
            console.log("Adding '" + key + "=" + value + "' to '" + queryString + "'.");
            if (queryString == null) {
                if (document.location.href.split('?')[1] != null) {
                    queryString = document.location.href.split('?')[1];
                } else {
                    return "?" + key + "=" + value;
                }
            }

            var isExists = 0; var iFound = 0;
            if (queryString != "" && queryString != null) {
                isExists = queryString.indexOf(key);
                if (isExists > -1) {
                    var splitUrl = queryString.split('&');

                    if (splitUrl.length > 0) {
                        for (i = 0; i < splitUrl.length; i++) {
                            if (splitUrl[i].substring(0, key.length) == key)
                                iFound = i;
                        }
                        return "?" + queryString.replace(splitUrl[iFound], key + "=" + value);
                    } else {
                        return "?" + key + "=" + value;
                    }
                } else {
                    return "?" + queryString + "&" + key + "=" + value;
                }
            } else {
                return "?" + key + "=" + value;
            }
        } catch (e) {
            console.warn("Adding '" + key + "=" + value + "' to '" + queryString + "' is failed!");
            console.debug(e);
            return null;
        }
    };

    // set requirement level [None, Recommended, Required]
    this.setRequirementLevel = function (elmId, level) {
        try {
            console.log("Setting requirement level '" + level + "' to '" + elmId + "'.");
            Xrm.Page.getAttribute(elmId).setRequiredLevel(level);
        } catch (e) {
            console.warn("Setting requirement level '" + level + "' to '" + elmId + "' is failed!");
            console.debug(e);
        }
    };

    // get crm form type (0:Undefined, 1:Create, 2:Update, 3:Read Only, 4:Disabled, 5:Quick Create (Deprecated), 6:Bulk Edit)
    this.getFormType = function () {
        try {
            console.log("Getting form type.");
            return Xrm.Page.ui.getFormType();
        } catch (e) {
            console.warn("Getting form type is failed!");
            console.debug(e);
            return null;
        }
    };

    // set focus on element
    this.setFocus = function (elmId) {
        try {
            console.log("Setting focus to '" + elmId + "'.");
            Xrm.Page.ui.controls.get(elmId).setFocus();
        } catch (e) {
            console.warn("Setting focus to '" + elmId + "' is failed!");
            console.debug(e);
        }
    };

    // multiple select picklist
    this.makeMultipleSelect = function (orgPicklist, txtPicklist, valPicklist, size) {
        try {
            console.log("Making picklist '" + orgPicklist + "' multiple. (txtPicklist:'" + txtPicklist + "', valPicklist: '" + valPicklist + "', size:'" + size + "')");

            size = size == undefined ? 6 : size;
            $("#" + orgPicklist + " option:first").remove();
            $("#" + orgPicklist).attr({ multiple: 'multiple', size: size }).change(function () {
                $$.setValue(valPicklist, $(this).val().toString());
                var texts = new Array();
                $.each($("#" + orgPicklist + " option:selected"), function (i, elm) { texts.push($(elm).text()); });
                $$.setValue(txtPicklist, texts.join(', '));
            });

            var selected = $$.getValue(valPicklist);
            if (selected != null) {
                $.each(selected.split(','), function (i, val) {
                    $("#" + orgPicklist + " option[value='" + val + "']").attr('selected', 'selected');
                });
            }
        } catch (e) {
            console.warn("Making picklist '" + orgPicklist + "' multiple is failed! (txtPicklist:'" + txtPicklist + "', valPicklist: '" + valPicklist + "', size:'" + size + "')");
            console.debug(e);
        }
    };

    // makes two picklists related
    this.makePicklistRelated = function (parent, child) {
        try {
            console.log("Making picklists related '" + parent + "' - '" + child + "'.");

            var pPicklist = $('#' + parent);
            var cPicklist = $('#' + child);

            pPicklist.attr('_childs', cPicklist.html());
            cPicklist.empty();
            pPicklist.change(function () {
                var curVal = $(this).val();
                cPicklist.empty();
                $('<option/>').appendTo(cPicklist);

                if (curVal != '') {
                    var childs = $($(this).attr('_childs'));
                    $.each(childs, function (i, c) {
                        if ($(c).val().toString().indexOf(curVal) == 0) {
                            $(c).appendTo(cPicklist);
                        }
                    });
                }
            });

            pPicklist.change();
        } catch (e) {
            console.warn("Making picklists related '" + parent + "' - '" + child + "' is failed.");
            console.debug(e);
        }
    };

    // get server url
    this.getServerUrl = function () {
        try {
            console.log("Getting server url.");
            var url = document.location.toString();
            var curHost = url.split('//')[1].split('/')[0]; //crm2011dev
            var crmHost = WEB_SERVER_HOST; // crm2011dev
            var organization = ORG_UNIQUE_NAME; // orgname
            var protocol = url.split('//')[0]; // http
            var isOnPremise = AUTHENTICATION_TYPE == 0; // true

            if (isOnPremise)
                return protocol + "//" + curHost + "/" + organization;
            else
                return protocol + "//" + curHost;
        } catch (e) {
            try {
                console.warn("Getting server url is failed! returning default url.");
                console.debug(e);
                return Xrm.Page.context.getServerUrl(); // default dönsün
            } catch (ex) {
                console.warn("Getting default server url is failed!");
                console.debug(ex);
                return null;
            }
        }
    };

    // get service url
    this.getServiceUrl = function () {
        console.log("Getting service url.");
        return this.getServerUrl() + "/XRMServices/2011/OrganizationData.svc";
    };

    // get soap url
    this.getSoapUrl = function () {
        console.log("Getting soap url.");
        return this.getServerUrl() + "/XRMServices/2011/Organization.svc/web";
    };

    // get entity with id
    this.retrieveOne = function (entity, id, callback, async) {
        if (jQuery) {
            var serviceUrl = this.getServiceUrl();
            var select = "/" + entity + "Set(guid'" + id + "')";
            console.log("Retrieving a '" + entity + "' record with id '" + id + "'.");

            $.ajax({
                async: async != undefined ? async : this.async,
                type: "GET",
                contentType: "application/json; charset=utf-8",
                datatype: "json",
                url: serviceUrl + select,
                beforeSend: function (XMLHttpRequest) { XMLHttpRequest.setRequestHeader("Accept", "application/json"); },
                success: function (data, textStatus, XmlHttpRequest) {
                    console.info("'" + entity + "' record with id '" + id + "' is retrieved successfully!");
                    callback(data.d);
                },
                error: function (xmlHttpRequest, textStatus, errorThrown) {
                    console.error("Retrieving a '" + entity + "' record with id '" + id + "' is failed! Details are in below.");
                    console.debug(xmlHttpRequest);
                    console.debug(textStatus);
                    console.debug(errorThrown);
                    callback(null);
                }
            });
        } else {
            console.warn("retrieveOne function needs jQuery library to execute. Please include jQuery.");
        }
    };

    // get entity(s) with query
    this.retrieveWithQuery = function (entity, query, callback, async) {
        if (jQuery) {
            var serviceUrl = this.getServiceUrl();
            var select = "/" + entity + "Set?" + query;
            console.log("Retrieving a '" + entity + "' records with query '" + query + "'.");

            $.ajax({
                async: async != undefined ? async : this.async,
                type: "GET",
                contentType: "application/json; charset=utf-8",
                datatype: "json",
                url: serviceUrl + select,
                beforeSend: function (XMLHttpRequest) { XMLHttpRequest.setRequestHeader("Accept", "application/json"); },
                success: function (data, textStatus, XmlHttpRequest) {
                    console.info("'" + entity + "' records with query '" + query + "' is retrieved successfully!");
                    callback(data.d.results);
                },
                error: function (xmlHttpRequest, textStatus, errorThrown) {
                    console.error("Retrieving a '" + entity + "' records with query '" + query + "' is failed! Details are below.");
                    console.debug(xmlHttpRequest);
                    console.debug(textStatus);
                    console.debug(errorThrown);
                    callback(null);
                }
            });
        } else {
            console.warn("retrieveWithQuery function needs jQuery library to execute. Please include jQuery.");
        }
    };

    // update entity
    this.updateEntity = function (entity, id, changes, callback, async) {
        if (jQuery) {
            var serviceUrl = this.getServiceUrl();
            var select = "/" + entity + "Set(guid'" + id + "')";
            console.log("Updating '" + entity + "' entity with id '" + id + "'. Changes are in below.");
            console.log(changes);

            if (!top.window.JSON) {
                console.warn("window.JSON not found, please include json2.js!");
            }

            var jsonEntity = top.window.JSON.stringify(changes);
            $.ajax({
                async: async != undefined ? async : this.async,
                type: "POST",
                contentType: "application/json; charset=utf-8",
                datatype: "json",
                data: jsonEntity,
                url: serviceUrl + select,
                beforeSend: function (XMLHttpRequest) {
                    XMLHttpRequest.setRequestHeader("Accept", "application/json");
                    XMLHttpRequest.setRequestHeader("X-HTTP-Method", "MERGE");
                },
                success: function (data, textStatus, XmlHttpRequest) {
                    console.info("'" + entity + "' entity with id '" + id + "' is updated successfully!");
                    callback(true);
                },
                error: function (xmlHttpRequest, textStatus, errorThrown) {
                    console.error("Updating '" + entity + "' entity with id '" + id + "' is failed! Details are in below.");
                    console.debug(xmlHttpRequest);
                    console.debug(textStatus);
                    console.debug(errorThrown);
                    callback(false);
                }
            });
        } else {
            console.warn("updateEntity function needs jQuery library to execute. Please include jQuery.");
        }
    };

    // create entity
    this.createRecord = function (entity, newEntity, callback, async) {
        if (jQuery) {
            var serviceUrl = $$.getServiceUrl();
            var select = "/" + entity + "Set";
            console.log("Creating '" + entity + "' entity. Values are in below.");
            console.log(newEntity);

            if (!top.window.JSON) {
                console.warn("window.JSON not found, please include json2.js!");
            }

            var jsonEntity = top.window.JSON.stringify(newEntity);
            $.ajax({
                async: async != undefined ? async : this.async,
                type: "POST",
                contentType: "application/json; charset=utf-8",
                datatype: "json",
                data: jsonEntity,
                url: serviceUrl + select,
                beforeSend: function (XMLHttpRequest) {
                    XMLHttpRequest.setRequestHeader("Accept", "application/json");
                },
                success: function (data, textStatus, XmlHttpRequest) {
                    console.info("'" + entity + "' entity created successfully!");
                    callback(data["d"]);
                },
                error: function (xmlHttpRequest, textStatus, errorThrown) {
                    console.error("Creating '" + entity + "' entity is failed! Details are in below.");
                    console.debug(xmlHttpRequest);
                    console.debug(textStatus);
                    console.debug(errorThrown);
                    callback(false);
                }
            });
        } else {
            console.warn("createRecord function needs jQuery library to execute. Please include jQuery.");
        }
    };

    // delete entity
    this.deleteRecord = function (entity, id, callback, async) {
        if (jQuery) {
            var serviceUrl = this.getServiceUrl();
            var select = "/" + entity + "Set(guid'" + id + "')";
            console.log("Deleting '" + entity + "' entity with id '" + id + "'.");

            $.ajax({
                async: async != undefined ? async : this.async,
                type: "POST",
                contentType: "application/json; charset=utf-8",
                datatype: "json",
                url: serviceUrl + select,
                beforeSend: function (XMLHttpRequest) {
                    XMLHttpRequest.setRequestHeader("Accept", "application/json");
                    XMLHttpRequest.setRequestHeader("X-HTTP-Method", "DELETE");
                },
                success: function (data, textStatus, XmlHttpRequest) {
                    console.info("'" + entity + "' entity with id '" + id + "' deleted successfully!");
                    callback(true);
                },
                error: function (xmlHttpRequest, textStatus, errorThrown) {
                    console.error("Deleting '" + entity + "' entity with id '" + id + "' is failed! Details are in below.");
                    console.debug(xmlHttpRequest);
                    console.debug(textStatus);
                    console.debug(errorThrown);
                    callback(false);
                }
            });
        } else {
            console.warn("deleteRecord function needs jQuery library to execute. Please include jQuery.");
        }
    };

    // sort table
    this.sortTable = function (table, columnIndex, desc) {
        if (jQuery) {
            table.find('td').filter(function () {
                return $(this).index() === columnIndex;
            }).sortElements(function (a, b) {
                return $.text([a]) > $.text([b]) ? (desc ? -1 : 1) : (desc ? 1 : -1);
            }, function () {
                return this.parentNode;
            });
        } else {
            console.warn("sortTable function needs jQuery library to execute. Please include jQuery.");
        }
    };

    //get formatted date
    this.getFormattedDate = function (date, format) {
        try {
            console.warn("Formatting date '" + date + "' with format '" + format + "'.");

            var d = new Date();
            d.setTime(date.getTime());

            var retVal = format
				.replace('yyyy', d.getFullYear())
				.replace('MM', (d.getMonth() < 9 ? '0' : '') + (d.getMonth() + 1))
				.replace('dd', (d.getDate() < 10 ? '0' : '') + d.getDate())
				.replace('HH', (d.getHours() < 10 ? '0' : '') + d.getHours())
				.replace('mm', (d.getMinutes() < 10 ? '0' : '') + d.getMinutes())
				.replace('ss', (d.getSeconds() < 10 ? '0' : '') + d.getSeconds());

            return retVal;
        } catch (e) {
            console.warn("Formatting date '" + date + "' with format '" + format + "' failed!");
            console.debug(e);
            return null;
        }
    };

    // parses JSON dates (Date(1111111111) values)
    this.parseJSONDate = function (val) {
        try {
            console.log("Parsing json date '" + val + "'");
            return new Date(parseInt(val.replace("/Date(", "").replace(")/", ""), 10));
        } catch (e) {
            console.warn("Parsing json date '" + val + "' is failed!");
            console.debug(e);
            return null;
        }
    };

    // get querystring
    this.queryString = function (key) {
        try {
            console.log("Getting querystring value of '" + key + "'");
            var query = window.location.search.substring(1);
            var vars = query.split('&');
            for (i = 0; i < vars.length; i++) {
                var cVar = vars[i].split('=');
                if (cVar[0] == key) {
                    return cVar[1];
                }
            }
        } catch (e) {
            console.warn("Getting querystring value of '" + key + "' is failed!");
            console.debug(e);
            return null;
        }
    };

    // returns nullstr if obj is null else return itself
    this.ifNull = function (val, nullStr) {
        try {
            console.log("Checking value of '" + val + "' and return '" + nullStr + "' if its null.");
            nullStr = nullStr != undefined ? nullStr : '---';
            return (val == null || val == '') ? nullStr : val;
        } catch (e) {
            console.warn("Checking value of '" + val + "' and return '" + nullStr + "' if its null is failed!");
            console.debug(e);
            return null;
        }
    };

    // convert text to upper case
    this.toUpperCase = function (txt) {
        try {
            console.log("Converting '" + txt + "' to upper case.");
            txt = txt === null ? '' : txt;
            return txt.replace(/ı/g, 'I').replace(/i/g, 'İ').toUpperCase();
        } catch (e) {
            console.warn("Converting '" + txt + "' to upper case is failed!");
            console.debug(e);
            return null;
        }
    };

    // convert text to lower case
    this.toLowerCase = function (txt) {
        try {
            console.log("Converting '" + txt + "' to lower case.");
            txt = txt === null ? '' : txt;
            return txt.replace(/I/g, 'ı').replace(/İ/g, 'i').toLowerCase();
        } catch (e) {
            console.warn("Converting '" + txt + "' to lower case is failed!");
            console.debug(e);
            return null;
        }
    };

    // convert text to proper case
    this.toProperCase = function (txt) {
        try {
            console.log("Converting '" + txt + "' to proper case.");
            txt = txt === null ? '' : txt;
            return txt.replace(/(\w|[ÇİÖŞÜçıöşü])\S*/g, function (txt) {
                return $$.toUpperCase(txt.charAt(0)) + $$.toLowerCase(txt.substr(1));
            });
        } catch (e) {
            console.warn("Converting '" + txt + "' to proper case is failed!");
            console.debug(e);
            return null;
        }
    };

    // set upper case text to textfield, textarea
    this.setUpperCase = function (elmId) {
        try {
            console.log("Setting '" + elmId + "' value to upper case.");
            var txt = this.getValue(elmId);
            this.setValue(elmId, this.toUpperCase(txt));
        } catch (e) {
            console.warn("Setting '" + elmId + "' value to upper case is failed!");
            console.debug(e);
        }
    };

    // set upper case text to textfield, textarea
    this.setLowerCase = function (elmId) {
        try {
            console.log("Setting '" + elmId + "' value to lower case.");
            var txt = this.getValue(elmId);
            this.setValue(elmId, this.toLowerCase(txt));
        } catch (e) {
            console.warn("Setting '" + elmId + "' value to lower case is failed!");
            console.debug(e);
        }
    };

    // set proper case text to textfield, textarea
    this.setProperCase = function (elmId) {
        try {
            console.log("Setting '" + elmId + "' value to proper case.");
            var txt = this.getValue(elmId);
            this.setValue(elmId, this.toProperCase(txt));
        } catch (e) {
            console.warn("Setting '" + elmId + "' value to proper case is failed!");
            console.debug(e);
        }
    };

    // checks two guids are equal
    this.areGuidsEqual = function (guid1, guid2) {
        try {
            console.log("Checking '" + guid1 + "' and '" + guid2 + "' is equal guids.");
            guid1 = guid1.toString().replace(/[{}]/g, '').toLowerCase();
            guid2 = guid2.toString().replace(/[{}]/g, '').toLowerCase();
            return guid1 === guid2;
        } catch (e) {
            console.warn("Checking '" + guid1 + "' and '" + guid2 + "' is equal guids is failed!");
            console.debug(e);
            return false;
        }
    };

    // open entity rec
    this.openEntity = function (entityName, id) {
        try {
            console.log("Opening '" + entityName + "' with id '" + id + "'.");

            id = id != undefined ? id.replace('{', '').replace('}', '') : null;
            var url = this.getServerUrl() + "/main.aspx?etn=" + entityName + (id != null ? "&id=" + id : "") + "&pagetype=entityrecord";
            var width = 1020;
            var height = screen.height - 50;
            var left = ((screen.width - width) / 2);
            var windowName = entityName + id.replace(/-/gi, '');
            window.open(url, windowName, 'width=1020,height=' + height + ',top=0,left=' + left + ', scrollbars=0,resizable=1');
        } catch (e) {
            console.warn("Opening '" + entityName + "' with id '" + id + "' is failed.");
            console.debug(e);
        }
    };

    // get option set label
    this.getOptionSetLabel = function (EntityLogicalName, LogicalName, MetadataId, RetrieveAsIfPublished, attributeValue) {
        try {
            console.log("Getting '" + attributeValue + "' option set label for '" + EntityLogicalName + "' entity, '" + LogicalName + "' attribute.");

            var request = "<s:Envelope xmlns:s=\"http://schemas.xmlsoap.org/soap/envelope/\">";
            request += "<s:Body>";
            request += "<Execute xmlns=\"http://schemas.microsoft.com/xrm/2011/Contracts/Services\" xmlns:i=\"http://www.w3.org/2001/XMLSchema-instance\">";
            request += "<request i:type=\"a:RetrieveAttributeRequest\" xmlns:a=\"http://schemas.microsoft.com/xrm/2011/Contracts\">";
            request += "<a:Parameters xmlns:b=\"http://schemas.datacontract.org/2004/07/System.Collections.Generic\">";
            request += "<a:KeyValuePairOfstringanyType>";
            request += "<b:key>EntityLogicalName</b:key>";
            request += "<b:value i:type=\"c:string\" xmlns:c=\"http://www.w3.org/2001/XMLSchema\">" + EntityLogicalName + "</b:value>";
            request += "</a:KeyValuePairOfstringanyType>";
            if (MetadataId == null) { MetadataId = "00000000-0000-0000-0000-000000000000"; }
            request += "<a:KeyValuePairOfstringanyType>";
            request += "<b:key>MetadataId</b:key>";
            request += "<b:value i:type=\"ser:guid\"  xmlns:ser=\"http://schemas.microsoft.com/2003/10/Serialization/\">" + MetadataId + "</b:value>";
            request += "</a:KeyValuePairOfstringanyType>";
            request += "<a:KeyValuePairOfstringanyType>";
            request += "<b:key>RetrieveAsIfPublished</b:key>";
            request += "<b:value i:type=\"c:boolean\" xmlns:c=\"http://www.w3.org/2001/XMLSchema\">" + RetrieveAsIfPublished + "</b:value>";
            request += "</a:KeyValuePairOfstringanyType>";
            request += "<a:KeyValuePairOfstringanyType>";
            request += "<b:key>LogicalName</b:key>";
            request += "<b:value i:type=\"c:string\"   xmlns:c=\"http://www.w3.org/2001/XMLSchema\">" + LogicalName + "</b:value>";
            request += "</a:KeyValuePairOfstringanyType>";
            request += "</a:Parameters>";
            request += "<a:RequestId i:nil=\"true\" /><a:RequestName>RetrieveAttribute</a:RequestName></request>";
            request += "</Execute>";
            request += "</s:Body>";
            request += "</s:Envelope>";

            var req = new XMLHttpRequest();
            req.open("POST", this.getSoapUrl(), false);
            req.setRequestHeader("Accept", "application/xml, text/xml, */*");
            req.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
            req.setRequestHeader("SOAPAction", "http://schemas.microsoft.com/xrm/2011/Contracts/Services/IOrganizationService/Execute");
            req.send(request);

            var namespaces = { a: "http://schemas.microsoft.com/xrm/2011/Contracts", b: "http://schemas.datacontract.org/2004/07/System.Collections.Generic", c: "http://schemas.microsoft.com/xrm/2011/Metadata" };

            if (req.responseXML != null) {
                var attributeData = $$.selectSingleNode(req.responseXML, "//b:value", namespaces);

                if (attributeData != null) {
                    var nAttributeType = $$.selectSingleNode(attributeData, "c:AttributeType", namespaces);
                    var attributeType = nAttributeType.text || nAttributeType.textContent;

                    switch (attributeType) {
                        case "Picklist":
                            return $$.getPickListTextValue(attributeData, attributeValue, namespaces);
                        default:
                            break;
                    }
                }
            }
        } catch (e) {
            console.warn("Getting '" + attributeValue + "' option set label for '" + EntityLogicalName + "' entity, '" + LogicalName + "' attribute is failed!");
            console.debug(e);
            return null;
        }
    };

    // get all option set labels
    this.getOptionSet = function (EntityLogicalName, LogicalName, MetadataId, RetrieveAsIfPublished) {
        try {
            console.log("Getting option set labels for '" + EntityLogicalName + "' entity, '" + LogicalName + "' attribute.");
            var request = "<s:Envelope xmlns:s=\"http://schemas.xmlsoap.org/soap/envelope/\">";
            request += "<s:Body>";
            request += "<Execute xmlns=\"http://schemas.microsoft.com/xrm/2011/Contracts/Services\" xmlns:i=\"http://www.w3.org/2001/XMLSchema-instance\">";
            request += "<request i:type=\"a:RetrieveAttributeRequest\" xmlns:a=\"http://schemas.microsoft.com/xrm/2011/Contracts\">";
            request += "<a:Parameters xmlns:b=\"http://schemas.datacontract.org/2004/07/System.Collections.Generic\">";
            request += "<a:KeyValuePairOfstringanyType>";
            request += "<b:key>EntityLogicalName</b:key>";
            request += "<b:value i:type=\"c:string\" xmlns:c=\"http://www.w3.org/2001/XMLSchema\">" + EntityLogicalName + "</b:value>";
            request += "</a:KeyValuePairOfstringanyType>";
            if (MetadataId == null) { MetadataId = "00000000-0000-0000-0000-000000000000"; }
            request += "<a:KeyValuePairOfstringanyType>";
            request += "<b:key>MetadataId</b:key>";
            request += "<b:value i:type=\"ser:guid\"  xmlns:ser=\"http://schemas.microsoft.com/2003/10/Serialization/\">" + MetadataId + "</b:value>";
            request += "</a:KeyValuePairOfstringanyType>";
            request += "<a:KeyValuePairOfstringanyType>";
            request += "<b:key>RetrieveAsIfPublished</b:key>";
            request += "<b:value i:type=\"c:boolean\" xmlns:c=\"http://www.w3.org/2001/XMLSchema\">" + RetrieveAsIfPublished + "</b:value>";
            request += "</a:KeyValuePairOfstringanyType>";
            request += "<a:KeyValuePairOfstringanyType>";
            request += "<b:key>LogicalName</b:key>";
            request += "<b:value i:type=\"c:string\"   xmlns:c=\"http://www.w3.org/2001/XMLSchema\">" + LogicalName + "</b:value>";
            request += "</a:KeyValuePairOfstringanyType>";
            request += "</a:Parameters>";
            request += "<a:RequestId i:nil=\"true\" /><a:RequestName>RetrieveAttribute</a:RequestName></request>";
            request += "</Execute>";
            request += "</s:Body>";
            request += "</s:Envelope>";

            var req = new XMLHttpRequest();
            req.open("POST", this.getSoapUrl(), false);
            req.setRequestHeader("Accept", "application/xml, text/xml, */*");
            req.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
            req.setRequestHeader("SOAPAction", "http://schemas.microsoft.com/xrm/2011/Contracts/Services/IOrganizationService/Execute");
            req.send(request);

            var namespaces = { a: "http://schemas.microsoft.com/xrm/2011/Contracts", b: "http://schemas.datacontract.org/2004/07/System.Collections.Generic", c: "http://schemas.microsoft.com/xrm/2011/Metadata" };

            if (req.responseXML != null) {
                var attributeData = $$.selectSingleNode(req.responseXML, "//b:value", namespaces);

                if (attributeData != null) {
                    var optionSet = new Array();
                    var options = $$.selectSingleNode(attributeData, "c:OptionSet//c:Options", namespaces);
                    for (var i = 0; i < options.childNodes.length; i++) {
                        var item = {};
                        var nValue = $$.selectSingleNode(options.childNodes[i], "c:Value", namespaces);
                        var value = nValue.text || nValue.textContent;

                        var cLabel = $$.selectSingleNode(options.childNodes[i], "c:Label", namespaces);
                        var locLabel = $$.selectSingleNode(cLabel, "a:UserLocalizedLabel", namespaces);
                        var nText = $$.selectSingleNode(locLabel, "a:Label", namespaces);
                        var text = nText.text || nText.textContent;

                        item.value = value;
                        item.text = text;
                        optionSet.push(item);
                    }
                    return optionSet;
                }
            }
        } catch (e) {
            console.warn("Getting option set labels for '" + EntityLogicalName + "' entity, '" + LogicalName + "' attribute is failed!");
            console.debug(e);
            return null;
        }
    };

    // for internal use only
    this.getPickListTextValue = function (aData, aValue, namespaces) {
        var options = $$.selectSingleNode(aData, "c:OptionSet//c:Options", namespaces);
        for (var i = 0; i < options.childNodes.length; i++) {
            var nValue = $$.selectSingleNode(options.childNodes[i], "c:Value", namespaces);
            var value = nValue.text || nValue.textContent;

            if (value == aValue) {
                var cLabel = $$.selectSingleNode(options.childNodes[i], "c:Label", namespaces);
                var locLabel = $$.selectSingleNode(cLabel, "a:UserLocalizedLabel", namespaces);
                var nText = $$.selectSingleNode(locLabel, "a:Label", namespaces);
                var text = nText.text || nText.textContent;
                return text;
            }
        }
    };

    // set entity state
    this.setState = function (entity, id, state, status, successCallback, errorCallback) {
        try {
            console.log("Setting state '" + entity + "' entity state to '" + state + "', status to '" + status + "'.");
            successCallback = successCallback == undefined ? null : successCallback;
            errorCallback = errorCallback == undefined ? null : errorCallback;
            var requestMain = "";
            requestMain += "<s:Envelope xmlns:s=\"http://schemas.xmlsoap.org/soap/envelope/\">";
            requestMain += "  <s:Body>";
            requestMain += "    <Execute xmlns=\"http://schemas.microsoft.com/xrm/2011/Contracts/Services\" xmlns:i=\"http://www.w3.org/2001/XMLSchema-instance\">";
            requestMain += "      <request i:type=\"b:SetStateRequest\" xmlns:a=\"http://schemas.microsoft.com/xrm/2011/Contracts\" xmlns:b=\"http://schemas.microsoft.com/crm/2011/Contracts\">";
            requestMain += "        <a:Parameters xmlns:c=\"http://schemas.datacontract.org/2004/07/System.Collections.Generic\">";
            requestMain += "          <a:KeyValuePairOfstringanyType>";
            requestMain += "            <c:key>EntityMoniker</c:key>";
            requestMain += "            <c:value i:type=\"a:EntityReference\">";
            requestMain += "              <a:Id>" + id + "</a:Id>";
            requestMain += "              <a:LogicalName>" + entity + "</a:LogicalName>";
            requestMain += "              <a:Name i:nil=\"true\" />";
            requestMain += "            </c:value>";
            requestMain += "          </a:KeyValuePairOfstringanyType>";
            requestMain += "          <a:KeyValuePairOfstringanyType>";
            requestMain += "            <c:key>State</c:key>";
            requestMain += "            <c:value i:type=\"a:OptionSetValue\">";
            requestMain += "              <a:Value>" + state + "</a:Value>";
            requestMain += "            </c:value>";
            requestMain += "          </a:KeyValuePairOfstringanyType>";
            requestMain += "          <a:KeyValuePairOfstringanyType>";
            requestMain += "            <c:key>Status</c:key>";
            requestMain += "            <c:value i:type=\"a:OptionSetValue\">";
            requestMain += "              <a:Value>" + status + "</a:Value>";
            requestMain += "            </c:value>";
            requestMain += "          </a:KeyValuePairOfstringanyType>";
            requestMain += "        </a:Parameters>";
            requestMain += "        <a:RequestId i:nil=\"true\" />";
            requestMain += "        <a:RequestName>SetState</a:RequestName>";
            requestMain += "      </request>";
            requestMain += "    </Execute>";
            requestMain += "  </s:Body>";
            requestMain += "</s:Envelope>";
            var req = new XMLHttpRequest();
            req.open("POST", this.getSoapUrl(), true); // Responses will return XML. It isn't possible to return JSON.
            req.setRequestHeader("Accept", "application/xml, text/xml, */*");
            req.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
            req.setRequestHeader("SOAPAction", "http://schemas.microsoft.com/xrm/2011/Contracts/Services/IOrganizationService/Execute");
            req.onreadystatechange = function () { $$.setStateResponse(req, successCallback, errorCallback); };
            req.send(requestMain);
        } catch (e) {
            console.warn("Setting state '" + entity + "' entity state to '" + state + "', status to '" + status + "' is failed!");
            console.debug(e);
            return false;
        }
    };

    this.setStateResponse = function (req, successCallback, errorCallback) {
        ///<summary>
        /// Recieves the assign response
        ///</summary>
        ///<param name="req" Type="XMLHttpRequest">
        /// The XMLHttpRequest response
        ///</param>
        ///<param name="successCallback" Type="Function">
        /// The function to perform when an successfult response is returned.
        /// For this message no data is returned so a success callback is not really necessary.
        ///</param>
        ///<param name="errorCallback" Type="Function">
        /// The function to perform when an error is returned.
        /// This function accepts a JScript error returned by the _getError function
        ///</param>
        if (req.readyState == 4) {
            if (req.status == 200) {
                if (successCallback != null)
                { successCallback(); }
            }
            else {
                errorCallback(this._getError(req.responseXML));
            }
        }
    };

    // retrieve all entities
    this.retrieveAllEntities = function (successCallback, errorCallback, retrieveAsIfPublished, isCustomEntity, async) {
        retrieveAsIfPublished = (retrieveAsIfPublished != undefined ? retrieveAsIfPublished : true);
        isCustomEntity = (isCustomEntity != undefined ? isCustomEntity : true);
        async = (async != undefined ? async : this.async);

        var requestMain = ""
        requestMain += "<s:Envelope xmlns:s=\"http://schemas.xmlsoap.org/soap/envelope/\">";
        requestMain += "  <s:Body>";
        requestMain += "    <Execute xmlns=\"http://schemas.microsoft.com/xrm/2011/Contracts/Services\" xmlns:i=\"http://www.w3.org/2001/XMLSchema-instance\">";
        requestMain += "      <request i:type=\"a:RetrieveAllEntitiesRequest\" xmlns:a=\"http://schemas.microsoft.com/xrm/2011/Contracts\">";
        requestMain += "        <a:Parameters xmlns:b=\"http://schemas.datacontract.org/2004/07/System.Collections.Generic\">";
        requestMain += "          <a:KeyValuePairOfstringanyType>";
        requestMain += "            <b:key>EntityFilters</b:key>";
        requestMain += "            <b:value i:type=\"c:EntityFilters\" xmlns:c=\"http://schemas.microsoft.com/xrm/2011/Metadata\">Privileges</b:value>";
        requestMain += "          </a:KeyValuePairOfstringanyType>";
        requestMain += "          <a:KeyValuePairOfstringanyType>";
        requestMain += "            <b:key>RetrieveAsIfPublished</b:key>";
        requestMain += "            <b:value i:type=\"c:boolean\" xmlns:c=\"http://www.w3.org/2001/XMLSchema\">" + (retrieveAsIfPublished ? "true" : "false") + "</b:value>";
        requestMain += "          </a:KeyValuePairOfstringanyType>";
        requestMain += "        </a:Parameters>";
        requestMain += "        <a:RequestId i:nil=\"true\" />";
        requestMain += "        <a:RequestName>RetrieveAllEntities</a:RequestName>";
        requestMain += "      </request>";
        requestMain += "    </Execute>";
        requestMain += "  </s:Body>";
        requestMain += "</s:Envelope>";

        var req = new XMLHttpRequest();
        req.open("POST", this.getSoapUrl(), async);
        req.setRequestHeader("Accept", "application/xml, text/xml, */*");
        req.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
        req.setRequestHeader("SOAPAction", "http://schemas.microsoft.com/xrm/2011/Contracts/Services/IOrganizationService/Execute");
        req.onreadystatechange = function () {
            if (req.readyState == 4) {
                if (req.status == 200) {

                    var namespaces = { a: "http://schemas.microsoft.com/xrm/2011/Contracts", b: "http://schemas.datacontract.org/2004/07/System.Collections.Generic", c: "http://schemas.microsoft.com/xrm/2011/Metadata" };

                    var entityList = [];
                    if (req.responseXML != null) {
                        var entities = $$.selectSingleNode(req.responseXML, "//b:value", namespaces);
                        if (entities != null) {
                            for (var i = 0; i < entities.childNodes.length; i++) {
                                var isCustomNode = $$.selectSingleNode(entities.childNodes[i], "c:IsCustomEntity", namespaces);
                                var isCustom = (isCustomNode.text || isCustomNode.textContent) === "true";

                                if ((isCustomEntity && isCustom) || !isCustomEntity) {
                                    var typeCode = $$.selectSingleNode(entities.childNodes[i], "c:ObjectTypeCode", namespaces);
                                    var logicalName = $$.selectSingleNode(entities.childNodes[i], "c:LogicalName", namespaces);
                                    var displayNameNode = $$.selectSingleNode(entities.childNodes[i], "c:DisplayName", namespaces);
                                    var locLabel = $$.selectSingleNode(displayNameNode, "a:UserLocalizedLabel", namespaces);
                                    var locLabelText = $$.selectSingleNode(locLabel, "a:Label", namespaces);
                                    var displayName = locLabelText != null ? (locLabelText.text || locLabelText.textContent) : logicalName;

                                    entityList.push({
                                        objectTypeCode: typeCode.text || typeCode.textContent,
                                        logicalName: logicalName.text || logicalName.textContent,
                                        displayName: displayName
                                    });
                                }
                            }
                        }
                    }

                    if (typeof successCallback == "function")
                        successCallback(entityList);
                } else {
                    if (typeof errorCallback == "function")
                        errorCallback(this._getError(req.responseXML));
                }
            }
        };
        req.send(requestMain);
    };

    this._getError = function (faultXml) {
        ///<summary>
        /// Parses the WCF fault returned in the event of an error.
        ///</summary>
        ///<param name="faultXml" Type="XML">
        /// The responseXML property of the XMLHttpRequest response.
        ///</param>
        var errorMessage = "Unknown Error (Unable to parse the fault)";
        if (typeof faultXml == "object") {
            try {
                var bodyNode = faultXml.firstChild.firstChild;
                //Retrieve the fault node
                for (var i = 0; i < bodyNode.childNodes.length; i++) {
                    var node = bodyNode.childNodes[i];
                    //NOTE: This comparison does not handle the case where the XML namespace changes
                    if ("s:Fault" == node.nodeName) {
                        for (var j = 0; j < node.childNodes.length; j++) {
                            var faultStringNode = node.childNodes[j];
                            if ("faultstring" == faultStringNode.nodeName) {
                                errorMessage = faultStringNode.text;
                                break;
                            }
                        }
                        break;
                    }
                }
            }
            catch (e) { };
        }
        return new Error(errorMessage);
    };

    this.selectSingleNode = function (context, expression, namespaces) {
        var doc = (context.nodeType != 9 ? context.ownerDocument : context);

        if (typeof doc.evaluate != "undefined") {
            var nsresolver = null;
            if (namespaces instanceof Object) {
                nsresolver = function (prefix) { return namespaces[prefix]; };
            }

            var result = doc.evaluate(expression, context, nsresolver, XPathResult.FIRST_ORDERED_NODE_TYPE, null);

            return (result !== null ? result.singleNodeValue : null);

        } else if (typeof context.selectSingleNode != "undefined") {
            if (namespaces instanceof Object) {
                var ns = "";
                for (var prefix in namespaces) {
                    if (namespaces.hasOwnProperty(prefix)) {
                        ns += "xmlns:" + prefix + "='" + namespaces[prefix] + "' ";
                    }
                }
                doc.setProperty("SelectionNamespaces", ns);
            }
            return context.selectSingleNode(expression);
        } else {
            console.warn("No xpath engine found");
        }
    };
}

// define $$ object of window
window.$$ = new arunesCrmJsLib();