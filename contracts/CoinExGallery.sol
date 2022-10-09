// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts@4.4.2/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts@4.4.2/access/Ownable.sol";
import "@openzeppelin/contracts@4.4.2/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

contract CoinExGallery is ERC721, Ownable {

    struct Painting {
        string name;
        int256 posX;
        int256 posY;
        int256 posZ;
        int256 rotX;
        int256 rotY;
        int256 rotZ;
        uint256 width;
        uint256 aspect;
        string url;
    }

    uint256 public maxSupply = 30;
    uint256 public galleryIndex;
    uint256 public fee = 1 ether; // 1 CET/TCET
    address payable feeCollector = payable(0x3Dd715f92DF40DDDeB5541AdBBAE38C7603fc8C9);

    constructor(uint256 _galleryIndex, Painting[] memory _paintings) payable ERC721("COINEXGALLERY", "CEG")  {

        require(msg.value >= fee, "Fee is required");

        galleryIndex = _galleryIndex;

        for (uint256 i = 0; i < _paintings.length; ++i) {
            mint(
                _paintings[i].name,
                _paintings[i].posX,
                _paintings[i].posY,
                _paintings[i].posZ,
                _paintings[i].rotX,
                _paintings[i].rotY,
                _paintings[i].rotZ,
                _paintings[i].width,
                _paintings[i].aspect,
                _paintings[i].url);
        }

        //_transfer(address(this), feeCollector, fee);
        feeCollector.transfer(fee);

    }

    using Counters for Counters.Counter;
    Counters.Counter private supply;


    mapping (address => Painting []) NFTOwners;


    Painting[] public paintings;

    function getGalleryIndex() public view returns (uint256) {
        return galleryIndex;
    }


    function getPaintings() public view returns (Painting [] memory) {
        return paintings;
    }

    function totalSupply() public view returns (uint256) {
        return supply.current();
    }

    function tokenURI(uint256 _tokenId) public
    view
    virtual
    override
    returns (string memory){

        Painting memory painting = paintings[_tokenId];

        bytes memory dataURI = abi.encodePacked(
            '{',
            '"name":"', painting.name, '",',
            '"description":"A PocketVR painting!",',
            '"image":"', painting.url,'"',
            '}'
        );
        return string(
            abi.encodePacked(
                "data:application/json;base64,",
                Base64.encode(dataURI)
            )
        );
    }

    function mint(
        string memory _name,
        int256 _posX,
        int256 _posY,
        int256 _posZ,
        int256 _rotX,
        int256 _rotY,
        int256 _rotZ,
        uint256 _width,
        uint256 _aspect,
        string memory _url
    ) private onlyOwner {

        require(supply.current() < maxSupply, "Max number of paitings reached!");
        supply.increment();
        _safeMint(msg.sender, supply.current());
        Painting memory _newPainting = Painting(_name, _posX, _posY, _posZ, _rotX, _rotY, _rotZ, _width, _aspect, _url);
        paintings.push(_newPainting);
        NFTOwners[msg.sender].push(_newPainting);

    }


}