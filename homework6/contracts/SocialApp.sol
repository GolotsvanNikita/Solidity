// SPDX-License-Identifier: MIT
pragma solidity >= 0.8.2 < 0.9.0;

contract SocialApp
{
    struct Post
    {
        uint id;
        address author;
        string content;
        uint likes;
        bool isDeleted;
    }

    Post[] public posts;
    mapping(uint => mapping(address => bool)) public hasLiked;

    function create_post(string memory _content) public
    {
        posts.push(Post(posts.length, msg.sender, _content, 0, false));
    }

    function delete_post(uint _id) public
    {
        require(_id < posts.length, "Post does not exist");
        require(posts[_id].author == msg.sender, "You`re not the author.");
        require(!posts[_id].isDeleted, "Already deleted");
        
        posts[_id].isDeleted = true;
    }

    function toggle_like(uint _id) public
    {
        require(_id < posts.length, "Post doesn`t exist");
        require(!posts[_id].isDeleted, "Post is deleted");

        if (hasLiked[_id][msg.sender])
        {
            posts[_id].likes--;
            hasLiked[_id][msg.sender] = false;
        }
        else
        {
            posts[_id].likes++;
            hasLiked[_id][msg.sender] = true;
        }
    }

    function get_all_posts() public view returns (Post[] memory)
    {
        return posts;
    }

    function check_like(uint _id, address _user) public view returns (bool)
    {
        return hasLiked[_id][_user];
    }
}