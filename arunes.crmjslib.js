﻿/* 
arunes.crmjslib v1.0.1 
last update: 2012-11-03 11:10
*/

// class and constructor
function arunesCrmJsLib() {
    // defines jquery ajax calls async or sync
    this.async = true;

    // if content in iframe
    if (Xrm == undefined || Xrm.Page.getAttribute == undefined)
        Xrm = parent.Xrm;

    // get elm. value
    this.getValue = function (elmId) { return Xrm.Page.getAttribute(elmId).getValue(); }

    // get current form's guid
    this.getCurrentId = function () { return Xrm.Page.data.entity.getId(); }

    // get current user id
    this.getUserId = function () { return Xrm.Page.context.getUserId(); }

    // get submit mode
    this.getSubmitMode = function (elmId) { return Xrm.Page.getAttribute(elmId).getSubmitMode(); }

    // get if value has changed
    this.isValueChanged = function (elmId) { return Xrm.Page.getAttribute(elmId).getIsDirty(); }

    // get elm. text (for picklists, lookups)
    this.getText = function (elmId) {
        var obj = Xrm.Page.ui.controls.get(elmId);
        if (obj != null) {
            switch (obj.getControlType()) {
                case 'lookup':
                    var val = this.getValue(elmId);
                    if (val != null) return val[0].name;
                    break;
                case 'optionset': return Xrm.Page.getAttribute(elmId).getText();
            }
        }
        return null;
    }

    // set elm. value
    this.setValue = function (elmId, val) { Xrm.Page.getAttribute(elmId).setValue(val); }

    // set lookup value
    this.setLookupValue = function (elmId, id, name, type) {
        var lookupValue = new Array();
        lookupValue[0] = new Object();
        lookupValue[0].id = id;
        lookupValue[0].name = name;
        lookupValue[0].entityType = type;
        this.setValue(elmId, lookupValue);
    }

    // set elm. disable
    this.setDisabled = function (elmId, disable) { Xrm.Page.ui.controls.get(elmId).setDisabled(disable); }

    // set elm. visibility
    this.setVisible = function (elmId, visible) { Xrm.Page.ui.controls.get(elmId).setVisible(visible); }

    // set tab/section visibility
    this.setVisibleTabSection = function (tabname, sectionname, show) {
        var tab = Xrm.Page.ui.tabs.get(tabname);
        if (tab != null) {
            if (sectionname == null)
                tab.setVisible(show);
            else {
                var section = tab.sections.get(sectionname);
                if (section != null) {
                    section.setVisible(show);
                    if (show) tab.setVisible(show);
                }
            }
        }
    }

    // get control
    this.getControl = function (elmId) {
        return Xrm.Page.getControl(elmId);
    };

    // set frame url
    this.setFrameUrl = function (elmId, url) {
        Xrm.Page.getControl(elmId).setSrc(url);
    }

    // add or replace parameter value of querystring
    this.addValueToQueryString = function (key, value, queryString) {
        if (queryString == null) {
            if (document.location.href.split('?')[1] != null) {
                queryString = document.location.href.split('?')[1];
            } else {
                return;
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
    }

    // set requirement level [None, Recommended, Required]
    this.setRequirementLevel = function (elmId, level) {
        Xrm.Page.getAttribute(elmId).setRequiredLevel(level);
    };

    // get crm form type (0:Undefined, 1:Create, 2:Update, 3:Read Only, 4:Disabled, 5:Quick Create (Deprecated), 6:Bulk Edit)
    this.getFormType = function () { return Xrm.Page.ui.getFormType(); }

    // set focus on element
    this.setFocus = function (elmId) { Xrm.Page.ui.controls.get(elmId).setFocus(); }

    // multiple select picklist
    this.makeMultipleSelect = function (orgPicklist, txtPicklist, valPicklist, size) {
        size = size == undefined ? 6 : size;

        $("#" + orgPicklist + " option:first").remove();
        $("#" + orgPicklist).attr({ multiple: 'multiple', size: size }).change(function () {
            $$.setValue(valPicklist, $(this).val().toString());
            var texts = new Array();
            $.each($("#" + orgPicklist + " option:selected"), function (i, elm) { texts.push($(elm).text()); });
            $$.setValue(txtPicklist, texts.join(', '));
        });

        var selected = $$.getValue(valPicklist);
        if (selected != null) { $.each(selected.split(','), function (i, val) { $("#" + orgPicklist + " option[value='" + val + "']").attr('selected', 'selected'); }); }
    }

    // makes two picklists related
    this.makePicklistRelated = function (parent, child) {
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
    }

    // get server url
    this.getServerUrl = function () {
        try {
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
        }
        catch (Error) {
            return Xrm.Page.context.getServerUrl(); // default dönsün
        }
    }

    // get service url
    this.getServiceUrl = function () { return this.getServerUrl() + "/XRMServices/2011/OrganizationData.svc"; }

    // get soap url
    this.getSoapUrl = function () { return this.getServerUrl() + "/XRMServices/2011/Organization.svc/web"; }

    // get entity with id
    this.retrieveOne = function (entity, id, callback) {
        if (jQuery) {
            var serviceUrl = this.getServiceUrl();
            var select = "/" + entity + "Set(guid'" + id + "')";

            $.ajax({
                async: this.async,
                type: "GET",
                contentType: "application/json; charset=utf-8",
                datatype: "json",
                url: serviceUrl + select,
                beforeSend: function (XMLHttpRequest) { XMLHttpRequest.setRequestHeader("Accept", "application/json"); },
                success: function (data, textStatus, XmlHttpRequest) {
                    callback(data.d);
                },
                error: function (xmlHttpRequest, textStatus, errorThrown) {
                    alert("Status: " + textStatus + "; ErrorThrown: " + errorThrown);
                }
            });
        } else {
            alert('jQuery required!');
        }
    }

    // get entity(s) with query
    this.retrieveWithQuery = function (entity, query, callback) {
        if (jQuery) {
            var serviceUrl = this.getServiceUrl();
            var select = "/" + entity + "Set?" + query;

            $.ajax({
                async: this.async,
                type: "GET",
                contentType: "application/json; charset=utf-8",
                datatype: "json",
                url: serviceUrl + select,
                beforeSend: function (XMLHttpRequest) { XMLHttpRequest.setRequestHeader("Accept", "application/json"); },
                success: function (data, textStatus, XmlHttpRequest) {
                    callback(data.d.results);
                },
                error: function (xmlHttpRequest, textStatus, errorThrown) {
                    alert("Status: " + textStatus + "; ErrorThrown: " + errorThrown);
                }
            });
        } else {
            alert('jQuery required!');
        }
    }

    // update entity
    this.updateEntity = function (entity, id, changes, callback) {
        if (jQuery) {
            var serviceUrl = this.getServiceUrl();
            var select = "/" + entity + "Set(guid'" + id + "')";
            var jsonEntity = top.window.JSON.stringify(changes);
            $.ajax({
                async: this.async,
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
                    callback(true);
                },
                error: function (xmlHttpRequest, textStatus, errorThrown) {
                    var errMsg = "Status: " + textStatus + "; ErrorThrown: " + top.window.JSON.stringify(errorThrown) + '\n--------------------------------\n';
                    errMsg += "Response: " + xmlHttpRequest.responseText + '\n--------------------------------\n';
                    errMsg += 'Entity: ' + entity + '\n';
                    errMsg += 'Id: ' + id + '\n';
                    errMsg += 'Data: ' + top.window.JSON.stringify(changes);
                    alert(errMsg);

                    callback(false);
                }
            });
        } else {
            alert('jQuery required!');
        }
    }

    // create entity
    this.createRecord = function (entity, newEntity, callback) {
        if (jQuery) {
            var serviceUrl = $$.getServiceUrl();
            var select = "/" + entity + "Set";
            var jsonEntity = top.window.JSON.stringify(newEntity);
            $.ajax({
                async: this.async,
                type: "POST",
                contentType: "application/json; charset=utf-8",
                datatype: "json",
                data: jsonEntity,
                url: serviceUrl + select,
                beforeSend: function (XMLHttpRequest) {
                    XMLHttpRequest.setRequestHeader("Accept", "application/json");
                },
                success: function (data, textStatus, XmlHttpRequest) {
                    callback(data["d"]);
                },
                error: function (xmlHttpRequest, textStatus, errorThrown) {
                    var errMsg = xmlHttpRequest.responseText + '\n--------------------------------\n';
                    errMsg += 'Entity: ' + entity + '\n';
                    errMsg += 'Data: ' + top.window.JSON.stringify(newEntity);
                    alert(errMsg);
                    callback(false);
                }
            });
        } else {
            alert('jQuery required!');
        }
    }

    // delete entity
    this.deleteRecord = function (entity, id, callback) {
        if (jQuery) {
            var serviceUrl = this.getServiceUrl();
            var select = "/" + entity + "Set(guid'" + id + "')";
            $.ajax({
                async: this.async,
                type: "POST",
                contentType: "application/json; charset=utf-8",
                datatype: "json",
                url: serviceUrl + select,
                beforeSend: function (XMLHttpRequest) {
                    XMLHttpRequest.setRequestHeader("Accept", "application/json");
                    XMLHttpRequest.setRequestHeader("X-HTTP-Method", "DELETE");
                },
                success: function (data, textStatus, XmlHttpRequest) {
                    callback(true);
                },
                error: function (xmlHttpRequest, textStatus, errorThrown) {
                    var errMsg = "Status: " + textStatus + "; ErrorThrown: " + top.window.JSON.stringify(errorThrown) + '\n--------------------------------\n';
                    errMsg += "Response: " + xmlHttpRequest.responseText + '\n--------------------------------\n';
                    errMsg += 'Entity: ' + entity + '\n';
                    errMsg += 'Id: ' + id + '\n';
                    alert(errMsg);

                    callback(false);
                }
            });
        } else {
            alert('jQuery required!');
        }
    }

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
            alert('jQuery required!');
        }
    }

    //get formatted date
    this.getFormattedDate = function (date, format) {
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
    }

    // parses JSON dates (Date(1111111111) values)
    this.parseJSONDate = function (val) {
        return new Date(parseInt(val.replace("/Date(", "").replace(")/", ""), 10));
    }

    // get querystring
    this.queryString = function (key) {
        var query = window.location.search.substring(1);
        var vars = query.split('&');
        for (i = 0; i < vars.length; i++) {
            var cVar = vars[i].split('=');
            if (cVar[0] == key) {
                return cVar[1];
            }
        }
    }

    // returns nullstr if obj is null else return itself
    this.ifNull = function (val, nullStr) {
        nullStr = nullStr != undefined ? nullStr : '---';
        return (val == null || val == '') ? nullStr : val;
    }

    // convert text to upper case
    this.toUpperCase = function (txt) {
        txt = txt === null ? '' : txt;
        return txt.replace(/ı/g, 'I').replace(/i/g, 'İ').toUpperCase();
    }

    // convert text to lower case
    this.toLowerCase = function (txt) {
        txt = txt === null ? '' : txt;
        return txt.replace(/I/g, 'ı').replace(/İ/g, 'i').toLowerCase();
    }

    // convert text to proper case
    this.toProperCase = function (txt) {
        txt = txt === null ? '' : txt;
        return txt.replace(/\w\S*/g, function (txt) {
            return $$.toUpperCase(txt.charAt(0)) + $$.toLowerCase(txt.substr(1));
        });
    }

    // set upper case text to textfield, textarea
    this.setUpperCase = function (elmId) {
        var txt = this.getValue(elmId);
        this.setValue(elmId, this.toUpperCase(txt));
    }

    // set upper case text to textfield, textarea
    this.setLowerCase = function (elmId) {
        var txt = this.getValue(elmId);
        this.setValue(elmId, this.toLowerCase(txt));
    }

    // set proper case text to textfield, textarea
    this.setProperCase = function (elmId) {
        var txt = this.getValue(elmId);
        this.setValue(elmId, this.toProperCase(txt));
    }

    // open entity rec
    this.openEntity = function (entiyName, id) {
        id = id != undefined ? id.replace('{', '').replace('}', '') : null;
        var url = this.getServerUrl() + "/main.aspx?etn=" + entiyName + (id != null ? "&id=" + id : "") + "&pagetype=entityrecord";
        var width = 1020;
        var height = screen.height - 50;
        var left = ((screen.width - width) / 2);
        var windowName = entiyName + id.replace(/-/gi, '')
        window.open(url, windowName, 'width=1020,height=' + height + ',top=0,left=' + left + ', scrollbars=0,resizable=1');
    }

    this.getOptionSetLabel = function (EntityLogicalName, LogicalName, MetadataId, RetrieveAsIfPublished, attributeValue) {
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

        if (req.responseXML != null) {
            var attributeData = req.responseXML.selectSingleNode("//b:value");
            if (attributeData != null) {
                var attributeType = attributeData.selectSingleNode("c:AttributeType").text;

                switch (attributeType) {
                    case "Picklist":
                        return getPickListTextValue(attributeData, attributeValue);
                        break;
                    default:
                        break;
                }

                function getPickListTextValue(attributeData, attributeValue) {
                    var options = attributeData.selectSingleNode("c:OptionSet//c:Options");
                    for (var i = 0; i < options.childNodes.length; i++) {
                        var value = options.childNodes[i].selectSingleNode("c:Value").text;
                        if (value == attributeValue) {
                            var text = options.childNodes[i].selectSingleNode("c:Label").selectSingleNode("a:UserLocalizedLabel").selectSingleNode("a:Label").text;
                            return text;
                        }
                    }
                }
            }
        }
    }

    this.setState = function (entity, id, state, status, successCallback, errorCallback) {
        successCallback = successCallback == undefined ? null : successCallback;
        errorCallback = errorCallback == undefined ? null : errorCallback;
        var requestMain = ""
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
        req.open("POST", this.getSoapUrl(), true)
        // Responses will return XML. It isn't possible to return JSON.
        req.setRequestHeader("Accept", "application/xml, text/xml, */*");
        req.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
        req.setRequestHeader("SOAPAction", "http://schemas.microsoft.com/xrm/2011/Contracts/Services/IOrganizationService/Execute");
        req.onreadystatechange = function () { $$.setStateResponse(req, successCallback, errorCallback); };
        req.send(requestMain);
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
    }

}

// define $$ object of window
window.$$ = new arunesCrmJsLib();