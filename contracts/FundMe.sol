// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "./PriceConverter.sol";
import "hardhat/console.sol";

// pragma
//import
// error with the contract name + the error name


error FundMe__NotOwner();

/**
 * @title contract for crowd funding
 * @author mayowa Emmanuel
 * @notice this is a contract to test the fund me 
 * @dev im sure you know what to do.. this can help in autiomacticlly creating doucmentation with a tool called solc
 * 
 */
contract FundMe{
    using PriceConverter for uint256;

    uint256 public constant MINIMUNUSD = 40 * 1e18;
// naming convention-- s stands for storage, i_immutable.. storage costs a lot of gas
    address[] private s_funders;

    address private immutable i_owner;

// constant keywords are variales that cannot be changed...

// variable set0 one time bt outside the line they are decelared are called immutable... that is
// assigning the data somewhere else but only once....

    AggregatorV3Interface public s_priceFeed;
    constructor(address priceAddress) {
        i_owner = msg.sender;
        s_priceFeed =   AggregatorV3Interface(priceAddress);
    }
    mapping(address=> uint256) private s_addressToAmountFunded;
    // when using data froma librayry it is identifies as parameter.function
    // note always the first parametrer is called 
    // if we ha sth else it becomes first.function(other parameters)
    // msg.value.getConversionRate
     receive() external  payable {
        fund();
    }
    fallback() external  payable {
        fund();
    }
    function fund() public payable {
        // if (msg.value.getConversionRate(s_priceFeed) < MINIMUNUSD) revert FundMe__NotOwner();
        require(msg.value.getConversionRate(s_priceFeed) >= MINIMUNUSD, "Didnt send enough gaz");
        s_addressToAmountFunded[msg.sender] += msg.value; 
        s_funders.push(msg.sender);
    console.log(msg.sender);

    }
 
    function withdraw() public onlyOwner {
        for(uint256 funderIndex = 0; funderIndex < s_funders.length; funderIndex++)
        {
            address funder = s_funders[funderIndex];
            s_addressToAmountFunded[funder]= 0;
        }
    // to reset the array...the number in the (x)-> refers to the mininimum number of data in the 
    //new array....
            s_funders = new address[](0);

            // there are tree different ways to withdraw funds from a contract...
            // transfer- the easiets to use, uses 2500gaz and fails if the gaz is higher
            //send - uses 2500 gaz and return a boolean if the gaz is higer
            //call

                // payable(msg.sender).transfer(address(this).balance);

                // bool sendSuccess = payable (msg.sender).send(address(this).balance);
                // require(sendSuccess,"Send Failed");

            (bool callSuccess, )=payable (msg.sender).call{value: address(this).balance}('');
            require(callSuccess, " call Failed");
    }


function cheaperWithdraw () payable public onlyOwner{
    address[] memory funded = s_funders;
    for( uint i =0; i < funded.length;  i++){
        address funder =  funded[i];
        s_addressToAmountFunded[funder] = 0 ;  
    }
            s_funders = new address[](0);
 (bool callSuccess, )=payable (msg.sender).call{value: address(this).balance}('');
            require(callSuccess, " call Failed");


}
    modifier onlyOwner {
        // require(i_owner == msg.sender, "Sender is not owner");
        if (msg.sender != i_owner){
            revert FundMe__NotOwner();
        }
        _;
    }

    // how do you know when someone send ina money to the contract without calling the fund function
    // we wont be able to detedt them... of know how much they sent 
    // thuswe use this two functions receive(), fallback()

    function getOwners() public view returns(address){
        return i_owner;
    }
     
     function getFunders(uint x) public view returns(address){
        return  s_funders[x];
     }

     function getAddressToAmountFunded(address x) public view returns(uint256){
        return s_addressToAmountFunded[x];
     }

     function getPriceFeed () public view  returns(AggregatorV3Interface){
            return s_priceFeed;}
}
// unit teststing in test folder can be done locally and in  batches..abi
// uni testing can b e done on local host and a forked haedhat
// staging involves testing on a testnet