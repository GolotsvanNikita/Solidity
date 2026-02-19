import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { contractAddress, contractAbi } from './abi';
import './App.css';

declare global
{
  interface Window { ethereum?: any; }
}

const App: React.FC = () =>
{
  const [account, setAccount] = useState<string>('');
  const [contract, setContract] = useState<any>(null);
  
  const [posts, setPosts] = useState<any[]>([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [filterAuthor, setFilterAuthor] = useState('');

  const connectWallet = async () =>
  {
    if (!window.ethereum) return alert("Install wallet.");
    try
    {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();
      
      const appContract = new ethers.Contract(contractAddress, contractAbi, signer);
      
      setAccount(userAddress);
      setContract(appContract);
    }
    catch (error)
    {
      console.error(error);
    }
  };

  const loadPosts = async () =>
  {
    if (!contract || !account) return;
    try
    {
      const allPosts = await contract.get_all_posts();
      
      const formattedPosts = await Promise.all(allPosts.map(async (p: any) =>
      {
        return {
          id: Number(p.id),
          author: p.author,
          content: p.content,
          likes: Number(p.likes),
          isDeleted: p.isDeleted
        };
      }));

      setPosts(formattedPosts.filter(p => !p.isDeleted));
    }
    catch (error)
    {
      console.error("Load posts error:", error);
    }
  };

  useEffect(() =>
  {
    loadPosts();
  }, [contract, account]);

  const handleCreate = async () =>
  {
    if (!newPostContent) return;
    const tx = await contract.create_post(newPostContent);
    await tx.wait();
    setNewPostContent("");
    loadPosts();
  };

  const handleLike = async (id: number) =>
  {
    const tx = await contract.toggle_like(id);
    await tx.wait();
    loadPosts();
  };

  const handleDelete = async (id: number) =>
  {
    const tx = await contract.delete_post(id);
    await tx.wait();
    loadPosts();
  };

  const displayedPosts = filterAuthor 
    ? posts.filter(p => p.author.toLowerCase() === filterAuthor.toLowerCase())
    : posts;

  return (
    <div className="container">
      <header>
        {!account ?
        (
          <button onClick={connectWallet} className="primary-btn">Connect</button>
        ) :
        (
          <p className="account-badge">Account: {account}</p>
        )}
      </header>

      {account &&
      (
        <main>
          <section className="create-section card">
            <h2>New Post</h2>
            <textarea 
              value={newPostContent} 
              onChange={(e) => setNewPostContent(e.target.value)} 
              placeholder="Enter your description"
            />
            <button onClick={handleCreate} className="primary-btn">Publish</button>
          </section>

          <section className="filter-section card">
            <h3>Filter by Author</h3>
            <div className="filter-controls">
              <input 
                type="text" 
                placeholder="0x123..." 
                value={filterAuthor}
                onChange={(e) => setFilterAuthor(e.target.value)}
              />
              <button onClick={() => setFilterAuthor("")} className="secondary-btn">Clear Filter</button>
            </div>
          </section>

          <section className="feed">
            {displayedPosts.length === 0 ? <p>No posts found.</p> : null}
            
            {displayedPosts.map(post =>
            (
              <div key={post.id} className="post-card card">
                <div className="post-header">
                  <span className="author">{post.author}</span>

                  {post.author.toLowerCase() === account.toLowerCase() &&
                  (
                    <button onClick={() => handleDelete(post.id)} className="delete-btn">Delete</button>
                  )}
                </div>
                
                <p className="content">{post.content}</p>
                
                <div className="post-footer">
                  <button 
                    onClick={() => handleLike(post.id)} 
                    className={`like-btn ${post.isLikedByMe ? 'liked' : ''}`}
                  >
                    {post.likes} Likes
                  </button>
                </div>
              </div>
            ))}
          </section>
        </main>
      )}
    </div>
  );
}

export default App;