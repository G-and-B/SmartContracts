//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/presets/ERC721PresetMinterPauserAutoId.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "@openzeppelin/contracts/interfaces/IERC2981.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
// import "@openzeppelin/contracts/utils/ContextMixin.sol"; I think this is OpenSea specific


contract NFTToken is ERC721PresetMinterPauserAutoId, Ownable {

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    string private _uri;
    address private _recipient;

    constructor(address recipient,string memory _name, string memory _symbol, string memory uriBase) ERC721PresetMinterPauserAutoId(_name, _symbol, uriBase) {
        setBaseURI(uriBase);
        _tokenIds.increment();
        _recipient = recipient;
        _mint(recipient, _tokenIds.current());
    }

    function setBaseURI(string memory baseUri) private {
        _uri = baseUri;
    }

    /**
     * @dev Base URI for computing {tokenURI}. If set, the resulting URI for each
     * token will be the concatenation of the `baseURI` and the `tokenId`. Empty
     * by default, can be overridden in child contracts.
     */
    function _baseURI() internal view virtual override returns (string memory) {
        return _uri;
    }

}