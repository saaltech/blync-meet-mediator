import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Avatar } from '../../base/avatar';
import { config } from '../../../config';
import useRequest from '../../hooks/use-request';


import { IconContext } from 'react-icons';
import { BiSearch } from 'react-icons/bi';
import { IoIosCall } from 'react-icons/io';

// const items = [
//     {
//         "username": "midhun@saal.ai",
//         "name": "Midhun Pottammal",
//         "key": "5fd0842e178a16f5d628fc39",
//         "role": "manager",
//         "email": "midhun@saal.ai",
//         "avatar": "https://lh3.googleusercontent.com/a-/AOh14GhZzL9IPYFKkpgf3ilJH1zaijdkgtVRELcLoWAZ=s96-c",
//         "lastSeen": "2021-01-05T06:57:24.235Z"
//     },
//     {
//         "username": "android-idp1@saal.ai",
//         "name": "Android IDP1",
//         "key": "5fd1e4d03d716f996d6f137c",
//         "role": "manager",
//         "email": "android-idp1@saal.ai",
//         "status": "active",
//         "lastSeen": "2021-01-14T12:58:09.379Z"
//     },
//     // {
//     //     "username": "ihsanulhaq@saal.ai",
//     //     "name": "Ihsanulhaq Pervez",
//     //     "key": "5fd87ea86b38cb130685d673",
//     //     "role": "manager",
//     //     "email": "ihsanulhaq@saal.ai",
//     //     "avatar": "https://lh3.googleusercontent.com/a-/AOh14GigPwg4A-l4XHFU-wv_6bc7jLTqrvl9FIVziQiA=s96-c"
//     // },
//     {
//         "username": "rohit2@saal.ai",
//         "name": "rohit2",
//         "key": "5fed7a0698c681131f6b4bf3",
//         "role": "manager",
//         "email": "rohit2@saal.ai",
//         "avatar": "https:/gravatar.com/avatar/abc123",
//         "gender": "Male",
//         "mobile": "0547935098",
//         "group": "a123-123-456-789",
//         "status": "active",
//         "lastSeen": "2021-01-17T08:16:14.680Z"
//     }
// ];

function ConnectCall() {

    const [contactsData, setContactsData] = useState([]);
    const [selectedContact, setselectedContact] = useState(null);
    const [searchData, setSearchData] = useState('');
    const [totalData, setTotalData] = useState([]);
    const setData = data => {
        if (data && data.length) {
            setContactsData(data);
            console.log('set', [...data], 'is');
            setTotalData(data);
        } else {
            setContactsData([]);
        }
    }

    const [getUserContacts, fetchErrors] = useRequest({
        url: `${config.profileService + config.getContacts}`,
        method: 'get',
        onSuccess: data => setData(data)
    });

    useEffect(() => {
        getUserContacts(true);
    }, []);

    useEffect(() => {
        console.log('filter in  ', totalData);
        if (totalData && totalData.length) {
            console.log('filter in  ');
            const filteredData = totalData.filter((substring) => substring.name.toLocaleLowerCase().includes(searchData.toLocaleLowerCase()));
            console.log('filter', filteredData);
            setContactsData(filteredData);
        }
    }, [searchData]);

    function handleClickContact(value) {
        setselectedContact(value);
    }

    function _handleKeyDown(e) {
        // if (e.key === 'Enter') {
            console.log('do validate', e.target.value);
            if (searchData !== e.target.value) {
                console.log('do validate in', e.target.value);
                setSearchData(e.target.value);
            }
        // }
    }

    return <div className="connect-call-wrapper">
        <div className="listing-wrapper">
            <div className="total-contacts">
                Contacts ({contactsData && contactsData.length})
            </div>
            <div className="search-container">
                <IconContext.Provider value={{
                    style: {
                        color: '#9A9A9A'
                    }
                }}>
                    <BiSearch size={20} />
                </IconContext.Provider>
                <input
                    className='enter-search'
                    onChange={_handleKeyDown}
                    // onChange={() => { }}
                    placeholder={'Search'} // this.state.roomPlaceholder
                    type='text'
                />
            </div>
            <div className="listing-container">
                {contactsData.map((item) => (
                    <div className={`list-item ${selectedContact && selectedContact.key == item.key ? 'selected' : ''}`} onClick={() => { handleClickContact(item) }} key={item.key}>
                        <div className="profile-image">
                            <Avatar
                                className='avatarProfileImage'
                                displayName={item.name}
                                size={'54'}
                                url={item.avatar} />
                        </div>
                        <div className="user-details">
                            <div className="user-name">
                                <div className="name">{item.name}
                                </div>
                                {/* <div>{moment(item.lastSeen).format('hh:mm a')}</div> */}
                            </div>
                            {/* <div className="last-message">
                                message
                        </div> */}

                        </div>
                    </div>
                ))}
            </div>
        </div>
        <div className="chat-wrapper">
            {
                selectedContact ? <div className="chat-container">
                    <div className="header-contact">
                        <IconContext.Provider value={{
                            style: {
                                color: '#005C85'
                            }
                        }}>
                            <div className="call-icon">
                                <IoIosCall size={20} />
                            </div>
                        </IconContext.Provider>
                        <div className="profile-image-header">
                            <Avatar
                                className='avatarProfileHeaderImage'
                                displayName={selectedContact.name}
                                size={'40'}
                                url={selectedContact.avatar} />
                        </div>
                        <div className="user-details-header">
                            <div className="name-header">
                                {selectedContact.name}
                            </div>
                            <div className="status">
                                {selectedContact.status == 'active' ? 'Active' : 'Inactive'}
                            </div>
                        </div>
                    </div>
                </div> : (
                        <div className="no-contact-selected">Start a new Chat</div>
                    )
            }
        </div>
    </div>
}

export default ConnectCall;