angular.module('wechat.services', [])

.factory("userService", function($http) {
    var users = [];
    return {
        getUsers: function() {
            return $http.get("https://randomuser.me/api/?results=10").then(function(response) {
                users = response.data.results;
                return response.data.results;
            });
        },
        getUser: function(index) {
            return users[index];
        }
    };
})
.factory('localStorageService', [function() {
        return {
            get: function localStorageServiceGet(key, defaultValue) {
                var stored = localStorage.getItem(key);
                try {
                    stored = angular.fromJson(stored);
                } catch (error) {
                    stored = null;
                }
                if (defaultValue && stored === null) {
                    stored = defaultValue;
                }
                return stored;
            },
            update: function localStorageServiceUpdate(key, value) {
                if (value) {
                    localStorage.setItem(key, angular.toJson(value));
                }
            },
            clear: function localStorageServiceClear(key) {
                localStorage.removeItem(key);
            }
        };
    }])
.factory('dateService', [function() {
    return {
        handleMessageDate: function(messages) {
            var i = 0,
                length = 0,
                messageDate = {},
                nowDate = {},
                weekArray = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
                diffWeekValue = 0;
            if (messages) {
                nowDate = this.getNowDate();
                length = messages.length;
                for (i = 0; i < length; i++) {
                    messageDate = this.getMessageDate(messages[i]);
                    if(!messageDate){
                        return null;
                    }
                    if (nowDate.year - messageDate.year > 0) {
                        messages[i].lastMessage.time = messageDate.year + "";
                        continue;
                    }
                    if (nowDate.month - messageDate.month >= 0 ||
                        nowDate.day - messageDate.day > nowDate.week) {
                        messages[i].lastMessage.time = messageDate.month +
                            "月" + messageDate.day + "日";
                        continue;
                    }
                    if (nowDate.day - messageDate.day <= nowDate.week &&
                        nowDate.day - messageDate.day > 1) {
                        diffWeekValue = nowDate.week - (nowDate.day - messageDate.day);
                        messages[i].lastMessage.time = weekArray[diffWeekValue];
                        continue;
                    }
                    if (nowDate.day - messageDate.day === 1) {
                        messages[i].lastMessage.time = "昨天";
                        continue;
                    }
                    if (nowDate.day - messageDate.day === 0) {
                        messages[i].lastMessage.time = messageDate.hour + ":" + messageDate.minute;
                        continue;
                    }
                }
                // console.log(messages);
                // return messages;
            } else {
                console.log("messages is null");
                return null;
            }

        },
        getNowDate: function() {
            var nowDate = {};
            var date = new Date();
            nowDate.year = date.getFullYear();
            nowDate.month = date.getMonth();
            nowDate.day = date.getDate();
            nowDate.week = date.getDay();
            nowDate.hour = date.getHours();
            nowDate.minute = date.getMinutes();
            nowDate.second = date.getSeconds();
            return nowDate;
        },
        getMessageDate: function(message) {
            var messageDate = {};
            var messageTime = "";
            //2015-10-12 15:34:55
            var reg = /(^\d{4})-(\d{1,2})-(\d{1,2})\s(\d{1,2}):(\d{1,2}):(\d{1,2})/g;
            var result = new Array();
            if (message) {
                messageTime = message.lastMessage.originalTime;
                result = reg.exec(messageTime);
                if (!result) {
                    console.log("result is null");
                    return null;
                }
                messageDate.year = parseInt(result[1]);
                messageDate.month = parseInt(result[2]);
                messageDate.day = parseInt(result[3]);
                messageDate.hour = parseInt(result[4]);
                messageDate.minute = parseInt(result[5]);
                messageDate.second = parseInt(result[6]);
                // console.log(messageDate);
                return messageDate;
            } else {
                console.log("message is null");
                return null;
            }
        }
    };
}])
.factory('lawService', function (localStorageService) {
    return {
        init: function (laws) {
            var i = 0;
            var length = 0;
            var lawID = new Array();
            if (laws) {
                length = laws.length;
                for (; i < length; i++) {
                    lawID[i] = {
                        id: laws[i].id
                    };

                }
                localStorageService.update("lawID", lawID);
                for (i = 0; i < length; i++) {
                    localStorageService.update("law_" + laws[i].id, laws[i]);
                }
            }
        },
        getAllLaws: function () {
            var laws = new Array();
            var i = 0;
            var lawID = localStorageService.get("lawID");
            var length = 0;
            var law = null;
            if (lawID) {
                length = lawID.length;

                for (; i < length; i++) {
                    law = localStorageService.get("law_" + lawID[i].id);
                    if (law) {
                        laws.push(law);
                    }
                }
                return laws;
            }
            return null;

        },
        getLawById: function (id) {
            return localStorageService.get("law_" + id);
        },
        getAmountLawById: function (num, id) {
            var laws = [];
            var law = localStorageService.get("law_" + id).law;
            var length = 0;
            if (num < 0 || !law) return;
            length = law.length;
            if (num < length) {
                laws = law.splice(length - num, length);
                return laws;
            } else {
                return law;
            }
        },
        updateLaw: function (law) {
            var id = 0;
            if (law) {
                id = law.id;
                localStorageService.update("law_" + id, law);
            }
        },
        deleteLawId: function (id) {
            var lawId = localStorageService.get("lawID");
            var length = 0;
            var i = 0;
            if (!lawId) {
                return null;
            }
            length = lawId.length;
            for (; i < length; i++) {
                if (lawId[i].id === id) {
                    lawId.splice(i, 1);
                    break;
                }
            }
            localStorageService.update("lawID", lawId);
        },
        clearLaw: function (law) {
            var id = 0;
            if (law) {
                id = law.id;
                localStorageService.clear("law_" + id);
            }
        }
    };
})
.factory('compositeService', function (localStorageService) {
    return {
        init: function (composites) {
            var i = 0;
            var length = 0;
            var compositeID = new Array();
            if (composites) {
                length = composites.length;
                for (; i < length; i++) {
                    compositeID[i] = {
                        id: composites[i].id
                    };

                }
                localStorageService.update("compositeID", compositeID);
                for (i = 0; i < length; i++) {
                    localStorageService.update("composite_" + composites[i].id, composites[i]);
                }
            }
        },
        getAllComposites: function () {
            var composites = new Array();
            var i = 0;
            var compositeID = localStorageService.get("compositeID");
            var length = 0;
            var composite = null;
            if (compositeID) {
                length = compositeID.length;

                for (; i < length; i++) {
                    composite = localStorageService.get("composite_" + compositeID[i].id);
                    if (composite) {
                        composites.push(composite);
                    }
                }
                return composites;
            }
            return null;

        },
        getCompositeById: function (id) {
            return localStorageService.get("composite_" + id);
        },
        getAmountCompositeById: function (num, id) {
            var composites = [];
            var composite = localStorageService.get("composite_" + id).composite;
            var length = 0;
            if (num < 0 || !composite) return;
            length = composite.length;
            if (num < length) {
                composites = composite.splice(length - num, length);
                return composites;
            } else {
                return composite;
            }
        },
        updateLaw: function (composite) {
            var id = 0;
            if (composite) {
                id = composite.id;
                localStorageService.update("composite_" + id, composite);
            }
        },
        deleteCompositeId: function (id) {
            var compositeId = localStorageService.get("compositeID");
            var length = 0;
            var i = 0;
            if (!compositeId) {
                return null;
            }
            length = compositeId.length;
            for (; i < length; i++) {
                if (compositeId[i].id === id) {
                    compositeId.splice(i, 1);
                    break;
                }
            }
            localStorageService.update("compositeID", compositeId);
        },
        clearComposite: function (composite) {
            var id = 0;
            if (composite) {
                id = composite.id;
                localStorageService.clear("composite_" + id);
            }
        }
    };
})

.factory('casService', function (localStorageService) {
    return {
        init: function (cass) {
            var i = 0;
            var length = 0;
            var casID = new Array();
            if (cass) {
                length = cass.length;
                for (; i < length; i++) {
                    casID[i] = {
                        id: cass[i].id
                    };

                }
                localStorageService.update("casID", casID);
                for (i = 0; i < length; i++) {
                    localStorageService.update("cas_" + cass[i].id, cass[i]);
                }
            }
        },
        getAllCass: function () {
            var cass = new Array();
            var i = 0;
            var casID = localStorageService.get("casID");
            var length = 0;
            var cas = null;
            if (casID) {
                length = casID.length;

                for (; i < length; i++) {
                    cas = localStorageService.get("cas_" + casID[i].id);
                    if (cas) {
                        cass.push(cas);
                    }
                }
                return cass;
            }
            return null;

        },
        getCasById: function (id) {
            return localStorageService.get("cas_" + id);
        },
        getAmountCasById: function (num, id) {
            var cass = [];
            var cas = localStorageService.get("cas_" + id).cas;
            var length = 0;
            if (num < 0 || !cas) return;
            length = cas.length;
            if (num < length) {
                cass = cas.splice(length - num, length);
                return cass;
            } else {
                return cas;
            }
        },
        updateCas: function (cas) {
            var id = 0;
            if (cas) {
                id = cas.id;
                localStorageService.update("cas_" + id, cas);
            }
        },
        deleteCasId: function (id) {
            var casId = localStorageService.get("casID");
            var length = 0;
            var i = 0;
            if (!casId) {
                return null;
            }
            length = casId.length;
            for (; i < length; i++) {
                if (casId[i].id === id) {
                    casId.splice(i, 1);
                    break;
                }
            }
            localStorageService.update("casID", casId);
        },
        clearCas: function (cas) {
            var id = 0;
            if (cas) {
                id = cas.id;
                localStorageService.clear("cas_" + id);
            }
        }
    };
})
