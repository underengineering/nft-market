// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract NFTContract is ERC1155 {
    struct Collection {
        string name;
        bool isOpen;
        uint[] nftIds;
    }

    struct NFTSaleData {
        bool isOnSale;
        uint price;
    }

    struct NFT {
        address owner;
        string name;
        bool isCollectible;
        uint collectionId;

        NFTSaleData saleData; 
    }

    struct Bid {
        address bidder;
        uint amount;
    }

    struct Auction {
        uint startPrice;
        uint maxPrice;
        Bid[] bids;
        bool isValid;
    }

    Collection[] public collections;
    NFT[] public nfts;

    mapping (uint => Auction) public collectionAuctions;

    address public owner = msg.sender;
    constructor() ERC1155("https://game.example/api/item/1.json") {
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Unauthorized: Owner only");
        _;
    }

    function getCollections() public view returns (Collection[] memory) {
        return collections;
    }

    function getNfts() public view returns (NFT[] memory) {
        return nfts;
    }

    function getAuction(uint collectionId) public view returns (Auction memory) {
        return collectionAuctions[collectionId];
    }

    function mintCommonNft(string calldata name) public onlyOwner returns(uint) {
        uint nftId = nfts.length;
        nfts.push(NFT(msg.sender, name, false, 0, NFTSaleData(false, 0)));
        _mint(msg.sender, nftId, 1, "");
        return nftId;
    }

    function createCollection(string calldata name) private returns(uint) {
        uint collectionId = collections.length;
        collections.push(Collection(name, false, new uint[](0)));
        return collectionId;
    }

    function mintCollectibleNft(uint collectionId, string calldata name) private returns(uint) {
        uint nftId = nfts.length;
        nfts.push(NFT(msg.sender, name, true, collectionId, NFTSaleData(false, 0)));
        _mint(msg.sender, nftId, 1, "");
        return nftId;
    }

    function mintCollection(string calldata name, string[] calldata nftNames) public onlyOwner returns(uint) {
        require(nftNames.length > 0, "Collection must include at least 1 nft card");

        uint collectionId = createCollection(name);
        Collection storage collection = collections[collectionId];

        for (uint nftIdx = 0; nftIdx < nftNames.length; nftIdx++) {
            uint nftId = mintCollectibleNft(collectionId, nftNames[nftIdx]);
            collection.nftIds.push(nftId);
        }

        return collectionId;
    }

    function placeNftOnSale(uint id, uint price) public {
        NFT storage nft = nfts[id];
        require(nft.owner == msg.sender, "You dont own this NFT");
        require(!nft.saleData.isOnSale, "This NFT is already on sale");
        require(!nft.isCollectible || (nft.isCollectible && collections[nft.collectionId].isOpen), "This collectible NFT belongs to a closed collection");

        nft.saleData.isOnSale = true;
        nft.saleData.price = price;
    }

    function buyNft(uint id) public payable {
        NFT storage nft = nfts[id];
        require(nft.owner != msg.sender, "You already own this NFT");
        require(!nft.isCollectible || (nft.isCollectible && collections[nft.collectionId].isOpen), "This collectible NFT belongs to a closed collection");
        require(nft.saleData.isOnSale, "This NFT is not on sale");
        require(msg.value == nft.saleData.price, "Invalid value");

        payable(nfts[id].owner).transfer(msg.value);

        nft.owner = msg.sender;
        nft.saleData.isOnSale = false;
    }

    function startAuction(uint id, uint startPrice, uint maxPrice) public {
        Collection memory collection = collections[id];
        require(!collection.isOpen, "This collection is already open");

        NFT storage nft = nfts[collection.nftIds[0]];
        require(nft.owner == msg.sender, "You do not own this collection");

        Auction storage auction = collectionAuctions[id];
        auction.startPrice = startPrice;
        auction.maxPrice = maxPrice;
        auction.isValid = true;
    } 

    function joinAuction(uint collectionId) public payable {
        Auction storage auction = collectionAuctions[collectionId];
        require(auction.isValid, "This collection is not on an auction");
        require(msg.value >= auction.startPrice && msg.value <= auction.maxPrice, "Invalid value");

        auction.bids.push(Bid(msg.sender, msg.value));
    }

    function finishAuction(uint collectionId) public {
        Collection storage collection = collections[collectionId];
        require(!collection.isOpen, "This collection is open");

        Auction storage auction = collectionAuctions[collectionId];
        require(auction.isValid, "This collection is not on an auction");

        address newOwner;
        uint winPrice = 0;

        // Select winner
        for (uint index = 0; index < auction.bids.length; index++) {
            if (auction.bids[index].amount > winPrice) {
                winPrice = auction.bids[index].amount;
                newOwner = auction.bids[index].bidder;
            }
        }

        // Transfer money back
        for (uint index = 0; index < auction.bids.length; index++) {
            if (auction.bids[index].bidder != newOwner) {
                payable(auction.bids[index].bidder).transfer(auction.bids[index].amount);
            }
        }

        payable(owner).transfer(winPrice);

        collection.isOpen = true;

        for (uint nftIdx = 0; nftIdx < collection.nftIds.length; nftIdx++) {
            uint nftId = collection.nftIds[nftIdx];
            safeTransferFrom(nfts[nftId].owner, newOwner, nftId, 1, "");
            nfts[nftId].owner = newOwner;
        }
    } 
}

