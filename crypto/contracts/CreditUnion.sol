pragma solidity ^0.8.18;


contract CreditUnion {

    uint32 public totalDeposit = 0;
    address public owner;
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
        uint32 repaidAmount;
    }

    struct CreditRequest {
        uint32 id;
        string deptor;
        uint32 amount;
        address[] approvedMembers;
    }

    struct JoinRequest {
        address user;
        string name;
        address[] approvedMembers;
    }


    Credit[] public credits;
    uint32 public creditCounter;

    CreditRequest[] public creditRequests;
    uint32 public creditRequestCounter;

    uint constant MAX_JOIN_REQUESTS = 1000; // Maximum number of join requests
    JoinRequest[MAX_JOIN_REQUESTS] public joinRequests; // Fixed-size array to store join requests
    uint numJoinRequests;

    address[] membersList;
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

        owner = msg.sender;
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

    function deposit(uint32 number) public {
        require(members[msg.sender].joined, "only members can deposit, join first");
        totalDeposit += number;
        members[msg.sender].contribution += number;

    }

    function createJoinRequest(string memory username) public {
        require(!members[msg.sender].joined, "you are already in members list");
        require(msg.sender != owner, "you are owner. No need to create join request");

        address[] memory approvedMembers;
        joinRequests[numJoinRequests] = JoinRequest(msg.sender, username, approvedMembers);
        numJoinRequests++;
    }

    function approveJoinRequest(uint32 id) public {
        require(members[msg.sender].joined || msg.sender == owner, "you must first join to approve");
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

    function createCreditRequest(uint32 amount, string memory deptor) public {
        require(msg.sender == owner, "only owner can create credit request");
        require(amount <= totalDeposit, "amount must be less than total deposit");

        address[] memory approvedMembers;
        creditRequests.push(CreditRequest(
            creditRequestCounter, 
            deptor, 
            amount, 
            approvedMembers
        ));

        creditRequestCounter++;
    }

    function approveCreditRequest(uint32 id) public {
        require(members[msg.sender].joined, "you must first join to approve");
        creditRequests[id].approvedMembers.push(msg.sender);

        CreditRequest memory request = creditRequests[id];

        if (isCreditRequestApproved(id)) {
            credits.push(Credit(creditCounter, request.deptor, request.amount, 0));
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

    function repay(uint32 id, uint32 amount) public {
        require(msg.sender == owner, "you must be owner to create repayment");

        credits[id].repaidAmount += amount;
        totalDeposit += amount;

    }

}
