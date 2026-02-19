// SPDX-License-Identifier: MIT
pragma solidity >=0.8.2 <0.9.0;

contract MediaStore
{
    struct Media
    {
        address owner;
        string cid;
        string name;
        uint timestamp;
        bool isDeleted;
    }

    Media[] public arts;

    event ArtCreated(uint index, address indexed owner, string cid, string name, uint timestamp);
    event ArtDeleted(uint index);

    function new_art(string memory cid, string memory name) external
    {
        uint currentIndex = arts.length;
        
        arts.push(
            Media(
                msg.sender,
                cid,
                name,
                block.timestamp,
                false
            )
        );

        emit ArtCreated(currentIndex, msg.sender, cid, name, block.timestamp);
    }

    function get_arts() external view returns(Media[] memory)
    {
        return arts;
    }

    function get_art(uint index) external view returns(Media memory)
    {
        return arts[index];
    }

    function delete_art(uint index) external
    {
        require(index < arts.length, "Invalid index");
        require(arts[index].owner == msg.sender, "You`re not the owner");
        require(!arts[index].isDeleted, "Already deleted");
        
        arts[index].isDeleted = true;
        emit ArtDeleted(index);
    }
}