//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

// deploy to goerli network at this address: 0x262272a81d27A14c3946fCa6714133112ae4b8E0

contract BuyMeCoffee {
    //Event to emit when a Memo is created.
    event NewMemo(
        address indexed from,
        uint256 timestamp,
        string name,
        string message
    );


    // Memo struct
    struct Memo {
        address from;
        uint256 timestamp;
        string name;
        string message;
    }

    // Address of the contract deployer.
    address payable owner;

    // list of all memos recieved from friends.
    Memo[] memos;

    constructor() {
        owner = payable(msg.sender);
    }


    function buyCoffee(string memory _name, string memory _message) public payable {
        require(msg.value > 0, "can't buy a coffee with 0 ETH");

        memos.push(Memo(msg.sender, block.timestamp, _name, _message));

        //emit a log event
        emit NewMemo(msg.sender, block.timestamp, _name, _message);
    }



    /**
    * @dev send the entire balance stored in this contract to the owner.
     */
    function withdrawTips() public {
        require(owner.send(address(this).balance));
    }



    /**
    * @dev retrieve all the memos received and stored on the blockchain
     */
     function getMemos() public view returns(Memo[] memory) {
         return memos;
     }
}
