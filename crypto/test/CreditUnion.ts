import { expect, assert } from "chai";
import { ethers } from "hardhat";

import { CreditUnion } from "../typechain-types";


const approvable = {
    DEPOSIT: 0,
    CREDIT: 1,
    REPAYMENT: 2        
}


function datetime() {
    return Date.now();
}


describe("Credit Union", function () {
    let contract: CreditUnion;
    let owner;
    let member1, member2, member3;
    let memberNames = ["member1", "member2", "member3"];
    let members = [];


    beforeEach(async () => {
        let Factory = await ethers.getContractFactory("CreditUnion");
        
        [owner, member1, member2, member3] = await ethers.getSigners();
        members = [member1, member2, member3, owner];
        Factory = Factory.connect(owner);

        // @ts-ignore
        let addresses: string[] = [member1.address, member2.address, member3.address];

        contract = await Factory.deploy(
            "test", 
            "Owner Name",
            addresses,
            memberNames,
            datetime()
        );
    });

    describe("create union test", function () {
        it("adds owner and other members", async function () {
            let result_members = await contract.getMembers();

            expect(result_members.length).to.eq(4);

        })
    })


    describe("deposit test", function () {

        it("creates deposit", async function () {
            await contract.createDeposit(1000, datetime());
                
            let deposit = await contract.deposits(0);
            let depositList = await contract.getDeposits();

            expect(deposit.member).to.eq(owner.address);
            expect(deposit.member).to.eq(owner.address);
            expect(deposit.amount).to.eq(1000);
            expect(depositList[0].amount).to.eq(1000);
        });
        
        it("approves deposit", async function () {
            await contract.createDeposit(1000, datetime());
            
            contract = contract.connect(member1);
            contract.approve(approvable.DEPOSIT, 0, datetime());

            let approvedMembers = await contract.depositApprovedList(0);

            expect(approvedMembers).to.deep.eq([member1.address]);
        })
        
        it("it confirms deposit if all approved", async function () {
            await contract.connect(member1).createDeposit(1000, datetime());
            
            for (const member of [owner, member2, member3]) {
                await contract.connect(member).approve(approvable.DEPOSIT, 0, datetime());
            }
            
            let deposit = await contract.deposits(0);
            let totalDeposit = await contract.totalDeposit();
            let member = await contract.members(member1.address);

            expect(deposit.confirmed).to.be.true;
            expect(totalDeposit).to.eq(1000);
            expect(member.contribution).to.eq(1000);
        });   
    })

    describe("join test", function () {
        let joiningUser;

        // create join request
        beforeEach(async () => {
            // 4th signer
            [,,,,joiningUser] = await ethers.getSigners();
            contract = contract.connect(joiningUser);
            await contract.createJoin("Sam Raymond"); 
            
            
        });

        it("is not confirmed", async function () {
            let member = await contract.members(joiningUser.address);

            expect(member.confirmed).to.be.false;
            expect(member.name).to.eq("Sam Raymond");
        })        
        
        it("creates join request", async function () {
            let members = await contract.getMembers();
            
            expect(members.at(-1).name).to.eq("Sam Raymond");
            
        });
        
        it("confirms if everyone approved", async function () {
            for (const member of members) {
                await contract.connect(member).approveJoin(joiningUser.address, datetime());    
            }
            
            let approveList = await contract.memberApprovedList(joiningUser.address);
            let joinedMember = await contract.members(joiningUser.address);

            expect(joinedMember.confirmed).to.be.true;
            expect(approveList).to.contain(member1.address);
        });
        
        it("returns list of members by addresses", async function () {
            let result = await contract.getMembersByAddresses([member1.address, member3.address]);

            expect(result[0].name).to.eq("member1");
            expect(result[1].name).to.eq("member3");
        })
    });

    describe("credit test", function () {
        beforeEach(async () => {
            // add initial deposit so we can create credits
            await contract.createDeposit(10_000, datetime());
            
            for (const member of members) {
                await contract.connect(member).approve(approvable.DEPOSIT, 0, datetime());
            }

            // create credit
            contract = contract.connect(member1);    
            await contract.createCredit(3000, 3, datetime());
        });

        it("creates credit", async function () {
            let credits = await contract.getCredits();
            expect(credits.length).to.eq(1);
        });

        it("approves credit", async function() {               
            for (const member of [owner, member2, member3]) {
                await contract.connect(member).approve(approvable.CREDIT, 0, datetime());
            }

            let credit = await contract.credits(0);
            let approvedMembers = await contract.creditApprovedList(0);

            expect(credit.confirmed).to.be.true;
            expect(approvedMembers).to.deep.eq([owner.address, member2.address, member3.address]);
            
        });

        it("test credit counter", async function () {
            await contract.createCredit(500, 3, datetime());
            await contract.createCredit(6000, 3, datetime());
            await contract.createCredit(7000, 3, datetime());
        
            let credits = await contract.getCredits();

            expect(await credits.map(c => c.id)).to.deep.eq([0, 1, 2, 3]);
        })

    });


    describe("repayment test", function () {
        beforeEach(async () => {
            // add deposit
            await contract.createDeposit(10_000, datetime());
            
            for (const member of members) {
                await contract.connect(member).approve(approvable.DEPOSIT, 0, datetime());
            }

            // create credit
            contract = contract.connect(member1);    
            await contract.createCredit(3000, 3, datetime());

            // approve credit
            for (const member of members) {
                await contract.connect(member).approve(approvable.CREDIT, 0, datetime());
            }
            
            contract = contract.connect(member1);
            await contract.createRepayment(0, 1000, 1, datetime());
        })

        it("creates repayment", async function() {
            let repayments = await contract.getRepaymentsByCredit(0);
            expect(repayments.length).to.eq(1);
        })

        it("approves repayment", async function() {
            for (const member of [owner, member2, member3]) {
                await contract.connect(member).approve(approvable.REPAYMENT, 0, datetime());
            }                

            let repayment = await contract.repayments(0);
            let credit = await contract.credits(0);
            
            let approvedMembers = await contract.repaymentApprovedList(0);
            let expected = [owner.address, member2.address, member3.address]

            expect(repayment.confirmed).to.be.true;
            expect(credit.repaid).to.eq(1000);
            expect(approvedMembers).to.deep.eq(expected);
        });
    })
})
