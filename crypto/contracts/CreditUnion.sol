// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/access/Ownable.sol";



contract CreditUnion {
    uint32 public totalDeposit = 0;
    string public ownerName;
    string public name;

    // credit
    struct Credit {
        uint32 id;
        uint32 amount;
        uint32 term;
        uint32 repaid;  
        string name;      
        address member;
        address[] approvedMembers;
        bool confirmed;
    }

    Credit[] public credits;
    uint32 public creditCounter;


    // repayment
    struct Repayment {
        uint32 id;
        uint32 month;
        uint32 amount;
        uint32 creditId;
        address[] approvedMembers;
        bool confirmed;
    }

    Repayment[] public repayments;
    uint32 public repaymentCounter;    

    // member

    // TODO add weight functionality here, so when somebody can delegate his vote right
    struct Member {
        uint32 contribution;
        string name;
        address member;
        address[] approvedMembers;
        address[] delegatedMembers; 
        bool voteDelegated;
        bool confirmed;
        bool created;
    }    

    address[] public membersList;
    mapping(address => Member) public members;

    // deposit
    struct Deposit {
        address member;
        uint32 amount;
        address[] approvedMembers;
        bool confirmed;
    }

    Deposit[] public deposits;
    uint32 public depositCounter;

    constructor(
        string memory _name, 
        string memory _ownerName,
        address[] memory memberAddresses, 
        string[] memory memberNames
    ) {
        ownerName = _ownerName;
        name = _name;
        address[] memory temp;

        // add initial members
        for (uint i = 0; i < memberAddresses.length; i++) {
            membersList.push(memberAddresses[i]);

            members[memberAddresses[i]] =Member({
                name: memberNames[i],
                member: memberAddresses[i],
                contribution: 0,
                confirmed: true,
                created: true,
                approvedMembers: temp,
                delegatedMembers: temp,
                voteDelegated: false
            });
        }

        // add creator
        membersList.push(msg.sender);
        members[msg.sender] = Member({
            name: _ownerName,
            member: msg.sender,
            contribution: 0,
            confirmed: true,
            created: true,
            approvedMembers: temp,
            delegatedMembers: temp,
            voteDelegated: false
        });

        // set counters
        creditCounter = 0;
        depositCounter = 0;
        repaymentCounter = 0;
    }


    // ========== utilites
    function includes(address member, address[] memory list) private pure returns(bool) {
        for (uint i = 0; i < list.length; i++) {
            if (list[i] == member) {
                return true;
            }
        }
        return false;
    }

    function getMembers() view public returns(Member[] memory) {
        Member[] memory allMembers = new Member[](membersList.length);
        for (uint i = 0; i < membersList.length; i++) { allMembers[i] = members[membersList[i]]; }
        return allMembers;
    }

    function memberApprovedList(address member) view public returns(address[] memory) {
        return members[member].approvedMembers;
    }    
    
    function delegatedMembers(address member) view public returns(address[] memory) {
        return members[member].delegatedMembers;
    }

    // ======= voting delegation
    function delegateVote(address reciever) public {
        require(!members[msg.sender].voteDelegated, unicode"вы уже доверили свой голос другому члену");

        members[reciever].delegatedMembers.push(msg.sender);
        members[msg.sender].voteDelegated = true;        
    }

    function takeBackVote(address from) public {
        address[] memory delegatedMembers = members[from].delegatedMembers;

        uint index = findIndex(msg.sender, delegatedMembers);
        require(index < delegatedMembers.length, unicode"вы не давали доверенность этому члену");

        // Replace item in given index with last item and reduce length by 1
        members[from].delegatedMembers[index] = delegatedMembers[delegatedMembers.length - 1];
        members[from].delegatedMembers.pop();

        members[msg.sender].voteDelegated = false;
    }

    function createDeposit(uint32 number) public {
        require(members[msg.sender].confirmed, unicode"только члены организации могут создавать депозит");

        address[] memory temp;
        deposits.push(Deposit({
            member: msg.sender,
            amount: number,
            approvedMembers: temp,
            confirmed: false
        }));
    }

    function approveDeposit(uint id) public {
        require(members[msg.sender].confirmed, unicode"вы не член организации");
        require(!includes(msg.sender, deposits[id].approvedMembers), unicode"вы уже подтвердили");

        for (uint i = 0; i < members[msg.sender].delegatedMembers.length; i++) {
            deposits[id].approvedMembers.push(members[msg.sender].delegatedMembers[i]);
        }

        Deposit memory current_deposit = deposits[id];
        bool allMembersApproved = current_deposit.approvedMembers.length == membersList.length;

        if (allMembersApproved) {
            deposits[id].confirmed = true;
            totalDeposit += current_deposit.amount;
        }
    }



    function findIndex(address value, address[] memory from) internal pure returns (uint) {
        for (uint i = 0; i < from.length; i++) {
            if (from[i] == value) {
                return i;
            }
        }
        return from.length + 10;
    }

    function createJoin(string memory username) public {
        require(!members[msg.sender].confirmed, unicode"вы уже являетесь членом организации");
        require(!members[msg.sender].created, unicode"you already created join request");

        address[] memory temp;

        members[msg.sender] = Member({
            name: username,
            member: msg.sender,
            approvedMembers: temp,
            contribution: 0,
            confirmed: false,
            created: true,
            delegatedMembers: temp,
            voteDelegated: false
        });
    }


    function approveJoin(address member) public {
        require(members[msg.sender].confirmed, unicode"вы должны быть членом организации чтобы подтверждать");
        require(!includes(msg.sender, members[member].approvedMembers), unicode"вы уже подтвердили");

        members[member].approvedMembers.push(msg.sender);

        for (uint i = 0; i < members[msg.sender].delegatedMembers.length; i++) {
            members[member].approvedMembers.push(members[msg.sender].delegatedMembers[i]);
        }

        Member memory current_member = members[member];
        bool allMembersApproved = current_member.approvedMembers.length == membersList.length;

        if (allMembersApproved) {
            membersList.push(member);
            members[member].confirmed = true; 
        }
    }

    function getPercentForMember(address member) public view returns(uint256) {
        uint256 sum = 0;

        for (uint i = 0; i < membersList.length; i++) {
            sum += members[membersList[i]].contribution;
        }

        return members[member].contribution * 100 / sum;
    }

    function createCredit(uint32 amount, uint32 term) public {
        require(amount <= totalDeposit, unicode"запрашиваемая сумма должна быть меньше чем казна организации");

        address[] memory temp;
        credits.push(Credit({
            id: creditCounter,
            amount: amount,
            term: term,
            repaid: 0,
            name: members[msg.sender].name,
            member: msg.sender,
            approvedMembers: temp,
            confirmed: false
        }));
    }

    function approveCredit(uint32 id) public {
        require(members[msg.sender].confirmed, unicode"вы должны быть членом организации чтобы подтверждать");
        require(!includes(msg.sender, credits[id].approvedMembers), unicode"вы уже подтвердили");

        credits[id].approvedMembers.push(msg.sender);

        for (uint i = 0; i < members[msg.sender].delegatedMembers.length; i++) {
            credits[id].approvedMembers.push(members[msg.sender].delegatedMembers[i]);
        }

        if (isCreditApproved(id)) {
            credits[id].confirmed = true;
            totalDeposit -= credits[id].amount;
            creditCounter++;
        }
    }

    // return bool if minimum 60% of all members have approved
    function isCreditApproved(uint32 id) public view returns (bool) {
        uint256 totalWeight = 0;
        uint256 approvedWeight = 0;

        Credit memory credit = credits[id];
        
        // calculate total weight
        for (uint i = 0; i < membersList.length; i++) {
            address memberAddress = membersList[i];
            Member memory member = members[memberAddress];
            totalWeight += member.contribution;
        }
        
        // calculate approved weight
        for (uint i = 0; i < credit.approvedMembers.length; i++) {
            address memberAddress = credit.approvedMembers[i];
            Member memory member = members[memberAddress];
            approvedWeight += member.contribution;
        }
        
        uint256 approvalThreshold = totalWeight * 6 / 10;
        return approvedWeight >= approvalThreshold;
    }

    function getCredits() public view returns (Credit[] memory) {
        return credits;
    }

    function creditApprovedList(uint id) view public returns(address[] memory) {
        return credits[id].approvedMembers;
    }    

    function createRepayment(uint32 id, uint32 amount, uint32 month) public {
        address[] memory temp;
        
        repayments.push(
            Repayment({
                id: repaymentCounter,
                creditId: id,
                amount: amount,
                month: month,
                approvedMembers: temp,
                confirmed: false
            })
        );

        repaymentCounter++;
    }

    function approveRepayment(uint32 id) public {
        require(members[msg.sender].confirmed, unicode"вы должны быть членом организации чтобы подтверждать");
        require(!includes(msg.sender, repayments[id].approvedMembers), unicode"вы уже подтвердили");

        repayments[id].approvedMembers.push(msg.sender);

        for (uint i = 0; i < members[msg.sender].delegatedMembers.length; i++) {
            repayments[id].approvedMembers.push(members[msg.sender].delegatedMembers[i]);
        }

        Repayment memory repayment = repayments[id];

        if (isRepaymentApproved(id)) {
            repayments[id].confirmed = true;
            credits[repayment.creditId].repaid += repayment.amount; 
        }
    }


    function isRepaymentApproved(uint32 id) public view returns (bool) {
        return repayments[id].approvedMembers.length == membersList.length;
    }

    function repaymentApproveList(uint32 id) public view returns (address[] memory) {
        return repayments[id].approvedMembers;
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

    // TODO add credit close when all repaid
}
