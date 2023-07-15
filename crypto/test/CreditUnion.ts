import { expect } from "chai";
import { ethers } from "hardhat";

import { CreditUnion } from "../typechain-types";


const approvable = {
    DEPOSIT: 0,
    CREDIT: 1,
    REPAYMENT: 2        
}


describe("Credit Union", function() {

    describe("Credit Union membership", function () {
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
                memberNames
            );
        });


        describe("deposit test", function () {

            it("creates deposit", async function () {
                await contract.createDeposit(1000);
                  
                let deposit = await contract.deposits(0);
                
                expect(deposit.member).to.eq(owner.address);
                expect(deposit.amount).to.eq(1000);
            });
            
            it("approves deposit", async function () {
                await contract.createDeposit(1000);
                
                contract = contract.connect(member1);
                contract.approve(approvable.DEPOSIT, 0);

                let approvedMembers = await contract.depositApprovedList(0);

                expect(approvedMembers).to.deep.eq([member1.address]);
            })
            
            it("it confirms deposit if all approved", async function () {
                await contract.createDeposit(1000);
                
                for (const member of members) {
                    await contract.connect(member).approve(approvable.DEPOSIT, 0);
                }
                
                let deposit = await contract.deposits(0);
                let totalDeposit = await contract.totalDeposit();
                
                expect(deposit.confirmed).to.be.true;
                expect(totalDeposit).to.eq(1000);
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
            
            it("creates join request", async function () {
                let members = await contract.getMembers();
                
                expect(members.at(-1).name).to.eq("Sam Raymond");
                
            });
            
            it("confirms if everyone approved", async function () {
                for (const member of members) {
                    await contract.connect(member).approveJoin(joiningUser.address);    
                }
                
                let approveList = await contract.memberApprovedList(joiningUser.address);
                let joinedMember = await contract.members(joiningUser.address);

                expect(joinedMember.confirmed).to.be.true;
                expect(approveList).to.contain(member1.address);
            })            
        });

        describe("credit test", function () {
            beforeEach(async () => {
                // add initial deposit so we can create credits
                await contract.createDeposit(10_000);
                
                for (const member of members) {
                    await contract.connect(member).approve(approvable.DEPOSIT, 0);
                }

                // create credit
                contract = contract.connect(member1);    
                await contract.createCredit(3000, 3);
            });

            it("creates credit", async function () {
                let credits = await contract.getCredits();
                expect(credits.length).to.eq(1);
            });

            it("approves credit", async function() {               
                for (const member of members) {
                    await contract.connect(member).approve(approvable.CREDIT, 0);
                }

                let credit = await contract.credits(0);
                let approvedMembers = await contract.creditApprovedList(0);

                expect(credit.confirmed).to.be.true;
                expect(approvedMembers).to.deep.eq([member1.address, member2.address, member3.address, owner.address]);
                
            });

        });


        describe("repayment test", function () {
            beforeEach(async () => {
                // add deposit
                await contract.createDeposit(10_000);
                
                for (const member of members) {
                    await contract.connect(member).approve(approvable.DEPOSIT, 0);
                }

                // create credit
                contract = contract.connect(member1);    
                await contract.createCredit(3000, 3);

                // approve credit
                for (const member of members) {
                    await contract.connect(member).approve(approvable.CREDIT, 0);
                }
                
                contract = contract.connect(member1);
                await contract.createRepayment(0, 1000, 1);
            })

            it("creates repayment", async function() {
                let repayments = await contract.getRepaymentsByCredit(0);
                expect(repayments.length).to.eq(1);
            })

            it("approves repayment", async function() {
                for (const member of members) {
                    await contract.connect(member).approve(approvable.REPAYMENT, 0);
                }                

                let repayment = await contract.repayments(0);
                let credit = await contract.credits(0);

                expect(repayment.confirmed).to.be.true;
                expect(credit.repaid).to.eq(1000);
            })

        })
    })
});
