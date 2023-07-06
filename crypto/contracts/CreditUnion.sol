// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/access/Ownable.sol";



contract CreditUnion is Ownable {
    uint32 public totalDeposit = 0;
    string public ownerName;
    string public name;

    struct Member {
        uint32 contribution;
        bool joined;
        string name;
    }

    struct Credit {
        uint32 id;
        string deptor;
        uint32 amount;
        uint32 term;
        uint32 repaidAmount;
    }

    struct Repayment {
        uint32 month;
        uint32 amount;
        uint32 creditId;
    }

    struct CreditRequest {
        uint32 id;
        string deptor;
        uint32 amount;
        uint32 term;
        address[] approvedMembers;
    }

    struct JoinRequest {
        address user;
        string name;
        address[] approvedMembers;
    }

    Credit[] public credits;
    uint32 public creditCounter;

    Repayment[] public repayments;
    uint32 public repaymentCounter;

    CreditRequest[] public creditRequests;
    uint32 public creditRequestCounter;

    uint constant MAX_JOIN_REQUESTS = 1000; // Maximum number of join requests
    JoinRequest[MAX_JOIN_REQUESTS] public joinRequests; // Fixed-size array to store join requests
    uint numJoinRequests;

    address[] public membersList;
    mapping(address => Member) public members;


    // only for testing purposes
    constructor(
        string memory _name, 
        address[] memory initialMembers, 
        string[] memory memberNames,
        string memory _ownerName
    ) {
        for (uint i = 0; i < initialMembers.length; i++) {

            membersList.push(initialMembers[i]);
            members[initialMembers[i]] = Member({ 
                name: memberNames[i],
                contribution: 0, 
                joined: true 
            });

            totalDeposit += members[initialMembers[i]].contribution;
        }

        ownerName = _ownerName;
        name = _name;

        membersList.push(msg.sender);
        members[msg.sender] = Member({
            name: _ownerName,
            contribution: 0,
            joined: true
        });

        creditRequestCounter = 0;
        creditCounter = 0;

    }


    // ====== MEMBERS FUNCTIONS

    function getMemberNames() view public returns(string[] memory membersNames) {
        string[] memory memberNames = new string[](membersList.length);

        for (uint i = 0; i < membersList.length; i++) {
            memberNames[i] = members[membersList[i]].name;
        }

        return memberNames;

    }

    function getMembers() view public returns(Member[] memory) {
        Member[] memory allMembers = new Member[](membersList.length);

        for (uint i = 0; i < membersList.length; i++) {
            allMembers[i] = members[membersList[i]];
        }

        return allMembers;
    }

    function getMembersAddresses() view public returns(address[] memory) {
        return membersList;
    }

    function deposit(uint32 number) public {
        require(members[msg.sender].joined, "only members can deposit, join first");
        totalDeposit += number;
        members[msg.sender].contribution += number;

    }

    function createJoinRequest(string memory username) public onlyOwner {
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
        joinRequests[id].approvedMembers.push(msg.sender);

        JoinRequest memory request = joinRequests[id];
        bool allMembersApproved = request.approvedMembers.length == membersList.length;
        bool ownerOnly = membersList.length == 1;

        if (allMembersApproved || ownerOnly) {
            membersList.push(request.user);
            members[request.user] = Member(0, true, request.name);

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

    function createCreditRequest(uint32 amount, uint32 term, string memory deptor) public onlyOwner {
        require(amount <= totalDeposit, "amount must be less than total deposit");

        address[] memory approvedMembers;
        creditRequests.push(CreditRequest(
            creditRequestCounter, 
            deptor, 
            amount, 
            term,
            approvedMembers
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
                    0
                )
            );
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

    function repay(uint32 id, uint32 amount, uint32 month) public onlyOwner {
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
