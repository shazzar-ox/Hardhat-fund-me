// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";


// you can use the uncheked key word to unchecked{}, to kind of indicate that a number may 
// be more ythan the max value allocated to it
library PriceConverter{
    function getPrice(  AggregatorV3Interface priceFeed) internal view returns (uint256){
            (,int256 price, , ,)=priceFeed.latestRoundData();

            //int256 can be negative or positive ....
            // convert int256 to uint256 
            return uint256(price * 1e10);
    }
    function getVersion() internal view returns (uint256) {
            AggregatorV3Interface priceFeed =  AggregatorV3Interface( 0x694AA1769357215DE4FAC081bf1f309aDC325306);
            return  priceFeed.version();        
    }

    function getConversionRate(uint256 ethAmount,  AggregatorV3Interface priceFeed) internal view returns(uint256){
            uint256 ethPrice= getPrice(priceFeed) ;
            uint ethAmountInUsd = (ethAmount * ethPrice) / 1e18;
            return  ethAmountInUsd;
    }
    // when using data froma librayry it is identifies as parameter.function

}
