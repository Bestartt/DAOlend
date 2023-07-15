import { expect } from "chai";
import { ethers } from "hardhat";

import { CreditUnion } from "../typechain-types";


describe("Credit Union", function() {

    describe("Credit Union membership", function () {
        let contract: CreditUnion;
        let owner;
        let member1, member2, member3;
        let memberNames = ["member1", "member2", "member3"];


        beforeEach(async () => {
            let Factory = await ethers.getContractFactory("CreditUnion");
            
            [owner, member1, member2, member3] = await ethers.getSigners();
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


        it("creates deposit", async function () {
            await contract.deposit(1000);

            let deposit = await contract.deposits(0);

            expect(deposit.member).to.be(owner.address);
            expect(deposit.amount).to.be("1000");
        })

        it("delegates vote", async function () {
            await contract.delegateVote(member1.address);

            let member = await contract.members(member1.address);
            contract.credits(0);

            expect(member.delegatedMembers())

        })


        describe("members join approvement", function() {
            let joiningUser;

            // create join request
            beforeEach(async () => {
                // 4th signer
                [,,,,joiningUser] = await ethers.getSigners();
                contract = contract.connect(joiningUser);
                await contract.createJoinRequest("Sam Raymond");                
            });

            it("should create join request", async function () {

                let result = await contract.joinRequests(0);
                expect(result[0]).to.eq(joiningUser.address);

            });

            it("member approve", async function() {
                contract = await contract.connect(member1);

                await contract.approveJoinRequest(0);

                let result = await contract.getApprovedMembersForJoinRequest(0);
                expect(result).to.contain(member1.address);

            });         

            it("automatically adds to members if everybody approved", async function() {
                contract = await contract.connect(member1);
                await contract.approveJoinRequest(0);          

                contract = await contract.connect(member2);
                await contract.approveJoinRequest(0);

                contract = await contract.connect(member3);
                await contract.approveJoinRequest(0);

                contract = await contract.connect(owner);
                await contract.approveJoinRequest(0);

                let result = await contract.members(joiningUser.address);

                expect(result.joined).to.be.true;
            });

            it("member adds deposit", async function () {
                contract = await contract.connect(member1);

                await contract.deposit(100);

            });

            it("not members cannot deposite", async function () {
                let user;
                [,,,,,user] = await ethers.getSigners();
                
                try {
                    await contract.connect(user).deposit(100);
                    expect(false, "did not throw an error");
                } catch(e) {
                    expect(e.message).to.contain("only members can deposit, join first");
                }
            });

            it("owner adds member to union", async function() {
                let new_member;
                [,,,,,new_member] = await ethers.getSigners();


            })


        });


        it("should return percent for member", async function () {

            const getPercent = async(address) => (await contract.getPercentForMember(address)).toNumber();

            await contract.connect(member1).deposit(100);
            await contract.connect(member2).deposit(200);
            await contract.connect(member3).deposit(300);

            let percent = await getPercent(member1.address);
            expect(percent).to.be.equal(16);

            percent = await getPercent(member2.address);
            expect(percent).to.be.equal(33);

            percent = await getPercent(member3.address);
            expect(percent).to.be.equal(50);
        });


        describe("credit approvement", function() {
            let debtorName = "Alex";

            beforeEach(async () => {
                await contract.connect(owner).deposit(100);
                await contract.connect(owner).createCreditRequest(50, 5, debtorName);                
            })

            it("should approve credit request", async function () {
                contract = contract.connect(member1);
                await contract.approveCreditRequest(0);

                let members = await contract.getApprovedMembers(0);
                expect(members[0]).to.be.equal(member1.address);
            });

            it("if 60% approved it should automatically create credit", async function () {
                await contract.connect(member1).deposit(100);
                await contract.connect(member2).deposit(100);

                contract = contract.connect(member1);
                await contract.approveCreditRequest(0);

                contract = contract.connect(member2);
                await contract.approveCreditRequest(0);

                expect((await contract.isCreditRequestApproved(0))).to.be.true;
                expect((await contract.credits(0)).deptor).to.eq(debtorName);

                
            })             
        }) 


    });


    describe("credit", function() {
        let contract: CreditUnion;
        let owner;
        let debtor;
        let member;

        let debtorName = "Alex";

        beforeEach(async() => {
            [owner, member] = await ethers.getSigners();
            let Factory = await ethers.getContractFactory("CreditUnion", owner);
            Factory = Factory.connect(owner);

            contract = await Factory.deploy(
                "test", 
                [member.address], 
                ["member"],
                "Owner Name (credit)"
            );

            await contract.connect(member).deposit(100);
            await contract.connect(owner).createCreditRequest(100, 5, debtorName); 
            await contract.connect(member).approveCreditRequest(0);    

            expect(await contract.owner()).to.eq(owner.address);
            expect((await contract.credits(0)).deptor).to.eq(debtorName);
            expect(await contract.totalDeposit()).to.eq(0);           
        });

        it("creates credit repayment", async function() {
            await contract.repay(0, 50);

            expect((await contract.credits(0)).repaidAmount).to.eq(50);
            expect(await contract.totalDeposit()).to.eq(50);

        });
    })
});
