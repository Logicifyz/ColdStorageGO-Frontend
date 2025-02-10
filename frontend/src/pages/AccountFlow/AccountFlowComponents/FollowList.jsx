import React from 'react';

const FollowList = ({ title, listData }) => {
    console.log('FollowList props:', title, listData); // Debug log to check the props
    return (
        <div className="p-4 bg-white text-black border rounded-lg shadow-lg max-w-md">
            <h2 className="text-xl font-bold">{title}</h2>
            <ul>
                {listData.length > 0 ? (
                    listData.map((item, index) => (
                        <li key={index}>{item.username}</li> // Example to display username
                    ))
                ) : (
                    <li>No {title.toLowerCase()} available</li>
                )}
            </ul>
        </div>
    );
};


export default FollowList;
