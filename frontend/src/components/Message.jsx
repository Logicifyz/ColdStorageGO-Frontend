import React from 'react';

const Message = ({ text, type }) => {
    // Determine the message background color based on the type
    const messageStyle = type === 'error'
        ? 'bg-red-500'
        : type === 'success'
            ? 'bg-green-500'
            : '';

    return (
        text && (
            <div className={`${messageStyle} text-white p-4 rounded mb-4 text-center`}>
                {text}
            </div>
        )
    );
};

export default Message;
