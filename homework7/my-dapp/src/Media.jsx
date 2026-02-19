import { useState, useEffect } from 'react';
import web3 from './lib/web3';
import mediaStoreContract from './lib/contracts/mediaStoreContract';
import lighthouse from "@lighthouse-web3/sdk";

function Media()
{
    const apiKey = 'b615a3bc.603c73b862384a3e863f9fc7daf60b7c';
    const imageUrl = 'https://gateway.lighthouse.storage/ipfs/';

    const [account, setAccount] = useState('');
    const [file, setFile] = useState('');
    const [name, setName] = useState('');
    const [arts, setArts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() =>
    {
        const init = async () =>
        {
            const accounts = await web3.eth.getAccounts();
            if (accounts.length > 0) setAccount(accounts[0]);
            await loadArts();
        };
        init();

        let createdSub, deletedSub;
        if (mediaStoreContract.events)
        {
            createdSub = mediaStoreContract.events.ArtCreated().on('data', () =>
            {
                loadArts();
            });
            deletedSub = mediaStoreContract.events.ArtDeleted().on('data', () =>
            {
                loadArts();
            });
        }

        return () => {
            if (createdSub) createdSub.unsubscribe();
            if (deletedSub) deletedSub.unsubscribe();
        };
    }, []);

    const loadArts = async () =>
    {
        try
        {
            const result = await mediaStoreContract.methods.get_arts().call();
            const formattedArts = result.map((art, index) =>
            ({
                id: index,
                owner: art.owner,
                cid: art.cid,
                name: art.name,
                timestamp: Number(art.timestamp),
                isDeleted: art.isDeleted
            }));

            setArts(formattedArts.filter(art => !art.isDeleted));
        }
        catch (error)
        {
            console.error(error);
        }
    };

    const submitEvent = async (e) =>
    {
        e.preventDefault();
        if (!file || !name) return alert("Enter a name and select a file");
        if (!account) return alert("Connect wallet");
        
        setLoading(true);
        try {
            const fileUpload = await lighthouse.upload([file], apiKey);
            const uploadedCid = fileUpload.data.Hash;

            await mediaStoreContract.methods.new_art(uploadedCid, name).send({ from: account });
            
            alert("Image successfully added!");
            setFile('');
            setName('');
            
            await loadArts(); 
        } catch (error) {
            console.error(error);
            alert("Upload failed");
        }
        setLoading(false);
    };

    const handleDelete = async (index) =>
    {
        try
        {
            await mediaStoreContract.methods.delete_art(index).send({ from: account });
            alert("Image deleted!");
            await loadArts();
        }
        catch (error)
        {
            console.error(error);
            alert("Error deleting image");
        }
    };

    const gridStyle =
    {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '20px',
        marginTop: '20px'
    };

    const cardStyle =
    {
        borderRadius: '8px',
        padding: '15px',
        backgroundColor: '#fff',
        boxShadow: '2 2px 4px rgba(0,0,0,0.5)',
    };

    const imgStyle =
    {
        width: '100%',
        height: '200px',
        objectFit: 'cover',
        borderRadius: '4px'
    };

    return (
        <div style={{ padding: '20px' }}>
            <form onSubmit={submitEvent} style={{ marginBottom: '30px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input 
                    type="text" 
                    placeholder="Image name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    required 
                    style={{ padding: '8px' }}
                />
                <input 
                    type="file" 
                    onChange={(e) => setFile(e.target.files[0])} 
                    required 
                />
                <button type="submit" disabled={loading} style={{ padding: '8px 15px', cursor: 'pointer' }}>
                    Upload
                </button>
            </form>

            <div style={gridStyle}>
                {arts.length === 0 && !loading && <p>No images found.</p>}
                
                {arts.map((art) => (
                    <div key={art.id} style={cardStyle}>
                        <img src={`${imageUrl}${art.cid}`} alt={art.name} style={imgStyle} />
                        <h3 style={{ margin: '10px 0 5px 0' }}>{art.name}</h3>
                        <p style={{ fontSize: '12px', color: '#666', wordBreak: 'break-all' }}>
                            Owner: {art.owner}
                        </p>
                        
                        {account && account.toLowerCase() === art.owner.toLowerCase() &&
                        (
                            <button 
                                onClick={() => handleDelete(art.id)} 
                                style={{ background: '#ff4444', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', marginTop: '10px' }}
                            >
                                Delete
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Media;