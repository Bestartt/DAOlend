// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/access/Ownable.sol";



contract CreditUnion is Ownable {
    uint32 public totalDeposit = 0;
    string public ownerName;
    string public name;


    // credit requests
    struct CreditRequest {
        uint32 id;
        string deptor;
        uint32 amount;
        uint32 term;
        address[] approvedMembers;
        address deptorAddress;
        bool creditCreated;
    }     

    CreditRequest[] public creditRequests;
    uint32 public creditRequestCounter;

    // credit
    struct Credit {
        uint32 id;
        string deptor;
        uint32 amount;
        uint32 term;
        uint32 repaidAmount;
        address deptorAddress;
    }

    Credit[] public credits;
    uint32 public creditCounter;

    // repayment
    struct Repayment {
        uint32 month;
        uint32 amount;
        uint32 creditId;
    }

    Repayment[] public repayments;
    uint32 public repaymentCounter;

    // join request
    struct JoinRequest {
        address user;
        string name;
        address[] approvedMembers;
    }

    uint constant MAX_JOIN_REQUESTS = 1000; // Maximum number of join requests
    JoinRequest[MAX_JOIN_REQUESTS] public joinRequests; // Fixed-size array to store join requests
    uint numJoinRequests;    

    // member
    struct Member {
        uint32 contribution;
        bool joined;
        string name;
        address _address;
    }    


    address[] public membersList;
    mapping(address => Member) public members;


    constructor(
        string memory _name, 
        address[] memory initialMembers, 
        string[] memory memberNames,
        string memory _ownerName
    ) {
        ownerName = _ownerName;
        name = _name;


        for (uint i = 0; i < initialMembers.length; i++) {
            membersList.push(initialMembers[i]);
            members[initialMembers[i]] = Member({ 
                name: memberNames[i],
                contribution: 0, 
                joined: true,
                _address: initialMembers[i] 
            });
        }

        membersList.push(msg.sender);
        members[msg.sender] = Member({
            name: _ownerName,
            contribution: 0,
            joined: true,
            _address: msg.sender
        });

        creditRequestCounter = 0;
        creditCounter = 0;

    }


    // ====== MEMBERS FUNCTIONS
    function getMembers() view public returns(Member[] memory) {
        Member[] memory allMembers = new Member[](membersList.length);

        for (uint i = 0; i < membersList.length; i++) {
            allMembers[i] = members[membersList[i]];
        }

        return allMembers;
    }

    function deposit(uint32 number) public {
        require(members[msg.sender].joined, "only members can deposit, join first");
        totalDeposit += number;
        members[msg.sender].contribution += number;
    }

    // join requests
    function createJoinRequest(string memory username) public {
        require(!members[msg.sender].joined, "you are already in members list");

        address[] memory approvedMembers;
        bool alreadyRequested = false;

        for (uint i = 0; i < numJoinRequests; i++) {
            if (msg.sender == joinRequests[i].user) {
                alreadyRequested = true;
                break;
            }
        }

        require(!alreadyRequested, "You already created join request");

        joinRequests[numJoinRequests] = JoinRequest(msg.sender, username, approvedMembers);
        numJoinRequests++;
    }

    function approveJoinRequest(uint32 id) public {
        require(members[msg.sender].joined, "you must first join to approve");

        address[] memory approvedMembers = joinRequests[id].approvedMembers;

        bool alreadyVoted = false;
        for (uint i = 0; i < approvedMembers.length; i++) {
            if (approvedMembers[i] == msg.sender) {
                alreadyVoted = true;
                break;
            }
        }

        require(!alreadyVoted, "You have already voted");

        joinRequests[id].approvedMembers.push(msg.sender);

        JoinRequest memory request = joinRequests[id];
        bool allMembersApproved = request.approvedMembers.length == membersList.length;
        bool ownerOnly = membersList.length == 1;

        if (allMembersApproved || ownerOnly) {
            membersList.push(request.user);
            members[request.user] = Member(0, true, request.name, request.user);

            delete joinRequests[id];   
        }

    }

    function getJoinRequests() public view returns (JoinRequest[] memory) {
        uint len = numJoinRequests;
        JoinRequest[] memory result = new JoinRequest[](len);

        for (uint i = 0; i < len; i++) {
            result[i] = joinRequests[i];
        }
        return result;
    }

    function getApprovedMembersForJoinRequest(uint id) public view returns(address[] memory) {
        return joinRequests[id].approvedMembers;
    }


    function getPercentForMember(address member) public view returns(uint256) {
        uint256 sum = 0;

        for (uint i = 0; i < membersList.length; i++) {
            sum += members[membersList[i]].contribution;
        }

        return members[member].contribution * 100 / sum;
    }

    // ===== CREDIT REQUEST FUNCTIONS ========
    function getCreditRequests() public view returns (CreditRequest[] memory) {
        return creditRequests;
    }

    function createCreditRequest(uint32 amount, uint32 term) public {
        require(amount <= totalDeposit, "amount must be less than total deposit");

        address[] memory approvedMembers;
        creditRequests.push(CreditRequest(
            creditRequestCounter, 
            members[msg.sender].name, 
            amount, 
            term,
            approvedMembers,
            msg.sender,
            false
        ));

        creditRequestCounter++;
    }

    function approveCreditRequest(uint32 id) public {
        require(members[msg.sender].joined, "you must first join to approve");

        creditRequests[id].approvedMembers.push(msg.sender);
        CreditRequest memory request = creditRequests[id];

        if (isCreditRequestApproved(id)) {
            credits.push(
                Credit(
                    creditCounter, 
                    request.deptor, 
                    request.amount, 
                    request.term, 
                    0,
                    msg.sender
                )
            );

            creditRequests[id].creditCreated = true;
            totalDeposit -= request.amount;
            creditCounter++;
        }

    }

    // return bool if minimum 60% of all members have approved
    function isCreditRequestApproved(uint32 Id) public view returns (bool) {
        uint256 totalWeight = 0;
        uint256 approvedWeight = 0;

        CreditRequest memory request = creditRequests[Id];
        
        for (uint i = 0; i < membersList.length; i++) {
            address memberAddress = membersList[i];
            Member memory member = members[memberAddress];
            totalWeight += member.contribution;
        }
        
        for (uint i = 0; i < request.approvedMembers.length; i++) {
            address memberAddress = request.approvedMembers[i];
            Member memory member = members[memberAddress];
            approvedWeight += member.contribution;
        }
        
        uint256 approvalThreshold = totalWeight * 6 / 10;
        
        return approvedWeight >= approvalThreshold;
    }

    function getApprovedMembers(uint32 Id) public view returns(address[] memory) {
        return creditRequests[Id].approvedMembers;
    }


    function getCredits() public view returns (Credit[] memory) {
        return credits;
    }

    function repay(uint32 id, uint32 amount, uint32 month) public {
        credits[id].repaidAmount += amount;
        repayments.push(
            Repayment(month, amount, id)
        );
        totalDeposit += amount;
    }

    function getRepaymentsByCredit(uint32 _creditId) public view returns (Repayment[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < repayments.length; i++) {
            if (repayments[i].creditId == _creditId) {
                count++;
            }
        }
        
        Repayment[] memory result = new Repayment[](count);
        uint256 index = 0;
        
        for (uint256 i = 0; i < repayments.length; i++) {
            if (repayments[i].creditId == _creditId) {
                result[index] = repayments[i];
                index++;
            }
        }
        
        return result;
    }
}
