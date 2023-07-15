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

    struct Member {
        uint32 contribution;
        string name;
        address member;
        address[] approvedMembers;
        bool confirmed;
        bool created;
    }    

    address[] public membersList;
    mapping(address => Member) public members;

    // deposit
    struct Deposit {
        address member;
        string name;
        uint32 amount;
        address[] approvedMembers;
        bool confirmed;
    }

    Deposit[] public deposits;
    uint32 public depositCounter;

    enum Approvable {
        DEPOSIT,
        CREDIT,
        REPAYMENT
    }

    constructor(string memory _name, string memory _ownerName,address[] memory memberAddresses, string[] memory memberNames) {
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
                approvedMembers: temp
            });
        }

        members[msg.sender] =Member({
            name: _ownerName,
            member: msg.sender,
            contribution: 0,
            confirmed: true,
            created: true,
            approvedMembers: temp
        });

        // set counters
        creditCounter = 0;
        depositCounter = 0;
        repaymentCounter = 0;
    }

    function approve(Approvable object, uint32 id) public memberOnly {
        address[] storage approvedMembers;

        // set reference to approvedMembers array
        if      (object == Approvable.DEPOSIT)   {approvedMembers = deposits[id].approvedMembers;} 
        else if (object == Approvable.CREDIT)    {approvedMembers = credits[id].approvedMembers;} 
        else if (object == Approvable.REPAYMENT) {approvedMembers = repayments[id].approvedMembers;} 
        else {
            revert("Wrong approvable struct identity");
        }

        // check if user already votes
        for (uint i = 0; i < approvedMembers.length; i++) {
            if (approvedMembers[i] == msg.sender) {
                revert(unicode"вы уже подтвердили");
            }
        }

        approvedMembers.push(msg.sender);
        bool allMembersApproved = approvedMembers.length == membersList.length;

        
        if (object == Approvable.CREDIT) {
            if (isCreditApproved(id) && !credits[id].confirmed) {
                credits[id].confirmed = true;
                totalDeposit -= credits[id].amount;
                creditCounter++;
            }
        }
        else if (object == Approvable.REPAYMENT) {
            Repayment memory repayment = repayments[id];
            if (allMembersApproved) {
                repayments[id].confirmed = true;
                credits[repayment.creditId].repaid += repayment.amount; 
            }
        } 
        else if (object == Approvable.DEPOSIT) {
            if (allMembersApproved) {
                deposits[id].confirmed = true;
                Deposit memory current_deposit = deposits[id];
                totalDeposit += current_deposit.amount;
            }
        }
    }

    // ========= JOIN ===========
    function createJoin(string memory username) public {
        require(!members[msg.sender].confirmed, unicode"вы уже являетесь членом организации");
        require(!members[msg.sender].created, unicode"вы уже создали запрос на вступление");

        address[] memory temp;

        members[msg.sender] = Member({
            name: username,
            member: msg.sender,
            approvedMembers: temp,
            contribution: 0,
            confirmed: false,
            created: true
        });

        membersList.push(msg.sender);
    }


    function approveJoin(address member) public memberOnly {
        require(!includes(msg.sender, members[member].approvedMembers), unicode"вы уже подтвердили");
        require(members[msg.sender].confirmed, unicode"вы уже подтвердили");

        members[member].approvedMembers.push(msg.sender);

        Member memory current_member = members[member];
        bool allMembersApproved = current_member.approvedMembers.length == membersList.length;

        if (allMembersApproved) {
            membersList.push(member);
            members[member].confirmed = true; 
        }
    }    
    
    // ============= MEMBERS ================
    function memberApprovedList(address member) view public returns(address[] memory) {
        return members[member].approvedMembers;
    } 

    function getMembers() view public returns(Member[] memory) {
        Member[] memory allMembers = new Member[](membersList.length);
        for (uint i = 0; i < membersList.length; i++) { allMembers[i] = members[membersList[i]]; }
        return allMembers;
    }

    function getMembersByAddresses(address[] calldata addresses) view public returns(Member[] memory) {
        Member[] memory resultMembers = new Member[](addresses.length);

        for (uint i = 0; i < addresses.length; i++) {
            resultMembers[i] = members[addresses[i]];
        }

        return resultMembers;
        
    }


    function createDeposit(uint32 number) public memberOnly {

        address[] memory temp;
        deposits.push(Deposit({
            member: msg.sender,
            name: members[msg.sender].name,
            amount: number,
            approvedMembers: temp,
            confirmed: false
        }));
    }

    function depositApprovedList(uint id) view public returns(address[] memory) {
        return deposits[id].approvedMembers;
    }  

    function getDeposits() view public returns (Deposit[] memory) {
        return deposits;
    }

    // ================ CREDITS ================
    function createCredit(uint32 amount, uint32 term) public memberOnly {
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


    // ================= REPAYMENTS ====================
    function createRepayment(uint32 id, uint32 amount, uint32 month) public memberOnly {
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

    function repaymentApprovedList(uint32 id) public view returns(address[] memory) {
        return repayments[id].approvedMembers;
    }


    // ========== UTILITIES ================

    modifier memberOnly() {
        require(members[msg.sender].confirmed, unicode"вы не член организации");
        _;
    }

    function includes(address member, address[] memory list) private pure returns(bool) {
        for (uint i = 0; i < list.length; i++) {
            if (list[i] == member) {
                return true;
            }
        }
        return false;
    }

    // TODO add credit close when all repaid
}
