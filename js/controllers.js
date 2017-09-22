angular.module('wechat.controllers', [])

.controller('casCtrl', function ($scope, $state, casService) {
    $scope.onSwipeRight = function() {
        $state.go("tab.law");
    };

    $scope.casDetail = function (cas) {
        $state.go("casList", {
            "casId": cas.id
        });
    };
    $scope.$on("$ionicView.beforeEnter", function () {

        $scope.cass = casService.getAllCass();
        $scope.popup = {
            isPopup: false,
            index: 0
        };
    });
})

.controller('casListCtrl', function ($scope, $state, $stateParams, casService, localStorageService) {
    $scope.$on("$ionicView.beforeEnter", function () {
        $scope.cas = casService.getCasById($stateParams.casId);
        $scope.casDetails = $scope.cas.details;

        var questions = $scope.casDetails;
        for (var i = 0; i < questions.length; i++) {
            var err = localStorageService.get("cas_error_" + $scope.cas.id + "_" + questions[i].number);
            if (err) {
                $scope.casDetails[i].style = "background: red;color: white;";
            }
            else {
                $scope.casDetails[i].style = "background: green;color: white;";
            }
        }
    });

    $scope.openQuestion = function (number) {
        $state.go("casDetail", { casId: $stateParams.casId, questionId: number });
    }
})

.controller('casDetailCtrl', function ($scope, $state, $stateParams, $ionicScrollDelegate, $timeout, casService, localStorageService) {
    var questionIndex = 0;
    questionIndex = $stateParams.questionId - 1;

    $scope.$on("$ionicView.beforeEnter", function () {
        $scope.cas = casService.getCasById($stateParams.casId);
        $scope.casDetails = $scope.cas.details;
        //第一道题
        $scope.currQuestion = $scope.casDetails[questionIndex];

        $scope.prevBtnDisabled = (questionIndex == 0);
        $scope.nextBtnDisabled = (questionIndex == ($scope.casDetails.length - 1));
    });
    $scope.answerVisible = false;
    $scope.showAnswer = function () {
        $scope.answerVisible = true;
    };
    $scope.prevQuestion = function () {
        if (questionIndex != 0) {
            $scope.answerVisible = false;
            questionIndex--;
            $scope.currQuestion = $scope.casDetails[questionIndex];
            $scope.prevBtnDisabled = (questionIndex == 0);
            $scope.nextBtnDisabled = (questionIndex == ($scope.casDetails.length - 1));
        }
    };
    $scope.nextQuestion = function () {
        if (questionIndex != $scope.casDetails.length - 1) {
            $scope.answerVisible = false;
            questionIndex++;
            $scope.currQuestion = $scope.casDetails[questionIndex];
            $scope.prevBtnDisabled = (questionIndex == 0);
            $scope.nextBtnDisabled = (questionIndex == ($scope.casDetails.length - 1));
        }
    };
    $scope.answer = function () {
        $scope.answerVisible = true;
        $scope.answerResult = "<span style='color:red;'>× 很遗憾，回答错误！</span>";
        var answers = $scope.currQuestion.answers;

        var rightAnswerCount = 0;
        var answerCount = 0;
        var rightAnswer = $scope.currQuestion.rightAnswer;
        for (var j = 0; j < answers.length; j++) {
            var temp = answers[j].number;
            if (answers[j].checked) {
                answerCount++;//答案个数
                if (rightAnswer.indexOf(temp) != -1) {
                    rightAnswerCount++;//正确答案个数
                }
            }
        }
        if (rightAnswerCount == rightAnswer.length && answerCount == rightAnswer.length) {
            $scope.answerResult = "<span style='color:blue;'>√ 恭喜，回答正确！</span>";
        }
        else {
            //加入错题列表
            localStorageService.update("cas_error_" + $stateParams.casId + "_" + (questionIndex + 1), $scope.currQuestion);
        }
    };
    $scope.questionList = function () {
        $state.go("casList", {
            "casId": $stateParams.casId
        });
    };
})

.controller('compositeCtrl', function ($scope, $state, compositeService) {

    $scope.onSwipeLeft = function () {
        $state.go("tab.law");
    };

    $scope.compositeDetail = function (composite) {
        $state.go("compositeList", {
            "compositeId": composite.id
        });
    };
    $scope.$on("$ionicView.beforeEnter", function () {

        $scope.composites = compositeService.getAllComposites();
        $scope.popup = {
            isPopup: false,
            index: 0
        };
    });

})

.controller('compositeListCtrl', function ($scope, $state, $stateParams, compositeService, localStorageService) {
    $scope.$on("$ionicView.beforeEnter", function () {
        $scope.composite = compositeService.getCompositeById($stateParams.compositeId);
        $scope.compositeDetails = $scope.composite.details;

        var questions = $scope.compositeDetails;
        for (var i = 0; i < questions.length; i++) {
            var err = localStorageService.get("composite_error_" + $scope.composite.id + "_" + questions[i].number);
            if(err)
            {
                $scope.compositeDetails[i].style = "background: red;color: white;";
            }
            else {
                $scope.compositeDetails[i].style = "background: green;color: white;";
            }
        }
    });

    $scope.openQuestion =function(number)
    {
        $state.go("compositeDetail", { compositeId: $stateParams.compositeId, questionId: number });
    }
})

.controller('compositeDetailCtrl', function ($scope, $state, $stateParams, $ionicScrollDelegate, $timeout, compositeService, localStorageService) {
    var questionIndex = 0;
    questionIndex = $stateParams.questionId - 1;

    $scope.$on("$ionicView.beforeEnter", function () {
        $scope.composite = compositeService.getCompositeById($stateParams.compositeId);
        $scope.compositeDetails = $scope.composite.details;
        //第一道题
        $scope.currQuestion = $scope.compositeDetails[questionIndex];

        $scope.prevBtnDisabled = (questionIndex == 0);
        $scope.nextBtnDisabled = (questionIndex == ($scope.compositeDetails.length - 1));
    });
    $scope.answerVisible = false;
    $scope.showAnswer = function () {
        $scope.answerVisible = true;
    };
    $scope.prevQuestion = function () {
        if (questionIndex != 0) {
            $scope.answerVisible = false;
            questionIndex--;
            $scope.currQuestion = $scope.compositeDetails[questionIndex];
            $scope.prevBtnDisabled = (questionIndex == 0);
            $scope.nextBtnDisabled = (questionIndex == ($scope.compositeDetails.length - 1));
        }
    };
    $scope.nextQuestion = function () {
        if (questionIndex != $scope.compositeDetails.length - 1) {
            $scope.answerVisible = false;
            questionIndex++;
            $scope.currQuestion = $scope.compositeDetails[questionIndex];
            $scope.prevBtnDisabled = (questionIndex == 0);
            $scope.nextBtnDisabled = (questionIndex == ($scope.compositeDetails.length - 1));
        }
    };
    $scope.answer = function () {
        $scope.answerVisible = true;
        $scope.answerResult = "<span style='color:red;'>× 很遗憾，回答错误！</span>";
        var answers = $scope.currQuestion.answers;

        var rightAnswerCount = 0;
        var answerCount = 0;
        var rightAnswer = $scope.currQuestion.rightAnswer;
        for (var j = 0; j < answers.length; j++) {
            var temp = answers[j].number;
            if (answers[j].checked) {
                answerCount++;//答案个数
                if (rightAnswer.indexOf(temp) != -1) {
                    rightAnswerCount++;//正确答案个数
                }
            }
        }
        if (rightAnswerCount == rightAnswer.length && answerCount == rightAnswer.length) {
            $scope.answerResult = "<span style='color:blue;'>√ 恭喜，回答正确！</span>";
        }
        else {
            //加入错题列表
            localStorageService.update("composite_error_" + $stateParams.compositeId + "_" + (questionIndex + 1), $scope.currQuestion);
        }
    };
    $scope.questionList = function () {
        $state.go("compositeList", {
            "compositeId": $stateParams.compositeId
        });
    };
})

.controller('lawCtrl', function ($scope, $state, lawService) {

    $scope.onSwipeRight = function () {
        $state.go("tab.composite");
    };

    $scope.onSwipeLeft = function () {
        $state.go("tab.case");
    };

    $scope.lawDetail = function (law) {
        $state.go("lawList", {
            "lawId": law.id
        });
    };
    $scope.$on("$ionicView.beforeEnter", function () {

        $scope.laws = lawService.getAllLaws();
        $scope.popup = {
            isPopup: false,
            index: 0
        };
    });

})

.controller('lawListCtrl', function ($scope, $state, $stateParams, lawService, localStorageService) {
    $scope.$on("$ionicView.beforeEnter", function () {
        $scope.law = lawService.getLawById($stateParams.lawId);
        $scope.lawDetails = $scope.law.details;

        var questions = $scope.lawDetails;
        for (var i = 0; i < questions.length; i++) {
            var err = localStorageService.get("law_error_" + $scope.law.id + "_" + questions[i].number);
            if (err) {
                $scope.lawDetails[i].style = "background: red;color: white;";
            }
            else {
                $scope.lawDetails[i].style = "background: green;color: white;";
            }
        }
    });

    $scope.openQuestion = function (number) {
        $state.go("lawDetail", { lawId: $stateParams.lawId, questionId: number });
    }
})

.controller('lawDetailCtrl', function ($scope, $state, $stateParams, $ionicScrollDelegate, $timeout, lawService, localStorageService) {
    var questionIndex = 0;
    questionIndex = $stateParams.questionId - 1;

    $scope.$on("$ionicView.beforeEnter", function () {
        $scope.law = lawService.getLawById($stateParams.lawId);
        $scope.lawDetails = $scope.law.details;
        //第一道题
        $scope.currQuestion = $scope.lawDetails[questionIndex];

        $scope.prevBtnDisabled = (questionIndex == 0);
        $scope.nextBtnDisabled = (questionIndex == ($scope.lawDetails.length - 1));
    });
    $scope.answerVisible = false;
    $scope.showAnswer = function () {
        $scope.answerVisible = true;
    };
    $scope.prevQuestion = function () {
        if (questionIndex != 0) {
            $scope.answerVisible = false;
            questionIndex--;
            $scope.currQuestion = $scope.lawDetails[questionIndex];
            $scope.prevBtnDisabled = (questionIndex == 0);
            $scope.nextBtnDisabled = (questionIndex == ($scope.lawDetails.length - 1));
        }
    };
    $scope.nextQuestion = function () {
        if (questionIndex != $scope.lawDetails.length - 1) {
            $scope.answerVisible = false;
            questionIndex++;
            $scope.currQuestion = $scope.lawDetails[questionIndex];
            $scope.prevBtnDisabled = (questionIndex == 0);
            $scope.nextBtnDisabled = (questionIndex == ($scope.lawDetails.length - 1));
        }
    };
    $scope.answer = function () {
        $scope.answerVisible = true;
        $scope.answerResult = "<span style='color:red;'>× 很遗憾，回答错误！</span>";
        var answers = $scope.currQuestion.answers;

        var rightAnswerCount = 0;
        var answerCount = 0;
        var rightAnswer = $scope.currQuestion.rightAnswer;
        for (var j = 0; j < answers.length; j++) {
            var temp = answers[j].number;
            if (answers[j].checked)
            {
                answerCount++;//答案个数
                if (rightAnswer.indexOf(temp) != -1) {
                    rightAnswerCount++;//正确答案个数
                }
            }
        }
        if (rightAnswerCount == rightAnswer.length && answerCount == rightAnswer.length) {
            $scope.answerResult = "<span style='color:blue;'>√ 恭喜，回答正确！</span>";
        }
        else {
            //加入错题列表
            localStorageService.update("law_error_" + $stateParams.lawId + "_" + (questionIndex + 1), $scope.currQuestion);
        }
    };
    $scope.questionList = function () {
        $state.go("lawList", {
            "lawId": $stateParams.lawId
        });
    };
})

