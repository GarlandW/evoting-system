App = {
    web3Provider: null,
    contracts: {},
    VoteCF: false,

    init: function () {
        return App.Connection();
    },

    Connection: function () {
        if (typeof web3 !== 'undefined') {
            App.web3Provider = web3.currentProvider;
            ethereum.enable();
            web3 = new Web3(web3.currentProvider);
        } else {
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
            web3 = new Web3(App.web3Provider);
        }
        return App.initialize();
    },

    initialize: function () {
        $.getJSON("Election.json", function (Election) {
            App.contracts.Election = TruffleContract(Election);
            App.contracts.Election.setProvider(App.web3Provider);
            App.actlist();
            return App.uiload();
        });
    },

    
    actlist: function () {
        App.contracts.Election.deployed().then(function (instance) {
            instance.UserVote({}, {
                fromBlock: 0,
                toBlock: 'latest'
            }).watch(function (error, event) {
                console.log("event triggered", event)
                App.uiload();
            });
        });
    },

    uiload: function () {
        var electionInstance;
        var instructions = $("#instructions");
        var formsubmission = $("#formsubmission");
        var processed = $("#votecounter");

        instructions.show();
        formsubmission.hide();
        processed.hide();
        web3.eth.getCoinbase(function (err, account) {
            if (err === null) {
                App.account = account;
                $("#ethereumaccount").html("Current Ethereum Address:" + account);
            }
        });

        App.contracts.Election.deployed().then(function (instance) {
            electionInstance = instance;
            return electionInstance.OpCt();
        }).then(function (OpCt) {

             //  var Optionresults = $("#Optionresults");
            //   Optionresults.empty();
            var optionform = $('#optionform');
            optionform.empty();

            for (var i = 1; i <= OpCt; i++) {
                electionInstance.optionmap(i).then(function (op) {
                    var counter = op[0];
                    var opchoice = op[1];
               //   var votecount = op[2];
              //    return electionInstance.creatorveri();
               //   if (creatorveri = 1){
               //  var rest = "<tr><th>" + counter + "</th><td>" + opchoice + "</td><td>" + voteCount + "</td></tr>"
               //   Optionresults.append(rest);
               //   }
                    var Optionarr = "<option value='" + counter + "' >" + opchoice + "</ option>"
                    optionform.append(Optionarr);
                });
            }
            return electionInstance.voters(App.account);
        }).then(function (VoteCF) {
            if (VoteCF) {
                $('form').hide();
                $("#votecounter").show();
                $("#instructions").hide();
            }
            instructions.hide();
            formsubmission.show();
        }).catch(function (error) {
            console.warn(error);
        });
    },

    VoteCheck: function () {
        var PKey = $('#optionform').val();
        App.contracts.Election.deployed().then(function (instance) {
            return instance.vote(PKey, { from: App.account });
        }).then(function (result) {
            $("#formsubmission").hide();
            $("#instructions").show();
            $("#votecounter").hide();
        }).catch(function (err) {
            console.error(err);
        });
    }
};
$(function () {
    $(window).load(function () {
        App.init();
    });
});

