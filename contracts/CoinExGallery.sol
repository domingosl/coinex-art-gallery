// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts@4.4.2/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts@4.4.2/access/Ownable.sol";
import "@openzeppelin/contracts@4.4.2/utils/Counters.sol";

contract CoinExGallery is ERC721, Ownable {

    constructor() ERC721("COINEXGALLERY", "CEG") {}

    using Counters for Counters.Counter;
    Counters.Counter private supply;


    uint256 public maxSupply = 10;
    uint256 public cost = 0.01 ether;

    mapping (address => Painting []) NFTOwners;

    struct Painting {
        string name;
        uint256 posX;
        uint256 posY;
        uint256 posZ;
        uint256 rotX;
        uint256 rotY;
        uint256 rotZ;
        uint256 width;
        uint256 aspect;
        string url;
    }

    Painting[] public paintings;


    function getPaintings() public view returns (Painting [] memory) {
        return paintings;
    }

    function totalSupply() public view returns (uint256) {
        return supply.current();
    }

    function mint(
        string memory _name,
        uint256 _posX,
        uint256 _posY,
        uint256 _posZ,
        uint256 _rotX,
        uint256 _rotY,
        uint256 _rotZ,
        uint256 _width,
        uint256 _aspect,
        string memory _url
        ) public onlyOwner {
            require(supply.current() < maxSupply, "Max numbers of paitings reached!");
            supply.increment();
            _safeMint(msg.sender, supply.current());
            Painting memory _newPainting = Painting(_name, _posX, _posY, _posZ, _rotX, _rotY, _rotZ, _width, _aspect, _url);
            paintings.push(_newPainting);
            NFTOwners[msg.sender].push(_newPainting);
    }


}