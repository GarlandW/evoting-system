pragma solidity 0.4.24;

contract Election {
    
	struct Voter {
        bool voted;
        int voteconf;
    }
	struct OptionCh {
        int counter;
        string opchoice;
        int voteCount;
    }
	
		event UserVote (
        int indexed OptionPKey
    );

	 int public OpCt; 

    mapping(address => Voter) public voters;

    mapping(int => OptionCh) public optionmap;

	function OptionConstruction (string foo) private {
    OpCt += 1;
	optionmap[OpCt] = OptionCh(OpCt, foo, 0);
	}

	function authorization(address voter) private {
    voters[voter].voteconf = 1;
    }


	/*
	address public creator;
	creator = 0x0C282453C9943A14767338f9c2C9608dB343FbD4;
	int public creatorveri;



	function creatorperm () public {
		require(msg.sender == creator);
		creatorveri = 1;
	}


	*/
    
	constructor () public {
	    OptionConstruction("Option 1");
        OptionConstruction("Option 2");
	    OptionConstruction("Option 3");
		OptionConstruction("Option 4");
		authorization(0x09d8BB02Bd4Ce750fB4B421acF0A818778A38C74);
		// creatorperm(); 
    }


    function vote (int OptionPKey) public {
        
		require(voters[msg.sender].voted == false);
		require(voters[msg.sender].voteconf == 1);

        voters[msg.sender].voted = true;

        optionmap[OptionPKey].voteCount += voters[msg.sender].voteconf;

        emit UserVote(OptionPKey);
    }
}