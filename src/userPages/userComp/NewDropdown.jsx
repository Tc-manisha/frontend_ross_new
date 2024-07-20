import New from '../../img/New.png'
import Dropdown from "react-bootstrap/Dropdown";
import { useNavigate } from 'react-router-dom';

export default function NewDropdown({ privileges, account_id, contact_id }) {

    let navigate = useNavigate()

    return (
        <>
            <Dropdown>
                <Dropdown.Toggle
                    className="btn btn-transparent text-primary ms-2 bg-white"
                    id="new-tab-btn"
                    style={{ backgroundColor: "transparent !important" }}
                >
                    <img
                        src="/add.svg"
                        alt="New"
                        style={{ marginRight: "5px" }}
                    />
                    <span className="ms-1">New</span>
                </Dropdown.Toggle>

                <Dropdown.Menu className="bg-primary menu-dropdown">

                    {privileges.includes('new-contact') || privileges.includes('contacts-new') && (
                        <Dropdown.Item
                            onClick={() => {
                                navigate("/account/contacts/new/" + account_id);
                            }}
                        >
                            New Contacts
                        </Dropdown.Item>
                    )}

                    {privileges.includes('account-document-upload') && (
                        <Dropdown.Item
                            onClick={() => {
                                navigate("/account-document-upload/" + account_id);
                            }}
                        >
                            New Documents
                        </Dropdown.Item>
                    )}

                    {privileges.includes('new-inperson') && (
                        <Dropdown.Item
                            onClick={() => {
                                navigate("/account/inperson/new/" + account_id);
                            }}
                        >
                            New Inperson
                        </Dropdown.Item>
                    )}

                    {privileges.includes('new-note') && (
                        <Dropdown.Item
                            onClick={() => {
                                let url =
                                    "/account/new-note?account_id=" + account_id;
                                if (contact_id) {
                                    url += "&contact_id=" + contact_id;
                                }
                                navigate(url, {
                                    state: {
                                        type: contact_id ? "contact" : "account",
                                        account_id: account_id,
                                        contact_id: contact_id,
                                    },
                                });
                            }}
                        >
                            New Note
                        </Dropdown.Item>
                    )}

                    {privileges.includes('new-pop') && (
                        <Dropdown.Item
                            onClick={() => {
                                dispatch(resetAllPops())
                                navigate("/account/new-pop/" + account_id);
                            }}
                        >
                            New POP
                        </Dropdown.Item>
                    )}

                    {privileges.includes('new-rfi') && (
                        <Dropdown.Item
                            onClick={() => {
                                navigate("/account/rfi/new/" + account_id);
                            }}
                        >
                            New RFI
                        </Dropdown.Item>
                    )}

                    {privileges.includes('new-support') && (
                        <Dropdown.Item
                            onClick={() => {
                                const type = account_id
                                    ? "account"
                                    : contact_id
                                        ? "contacts"
                                        : "site";
                                navigate("/account/new-support", {
                                    state: {
                                        type,
                                        account_id: account_id || "",
                                        contact_id: contact_id || "",
                                        // siteId: sitetId || '',
                                        accountName: accountName || "",
                                        contactName: contactName || "",
                                        siteName: siteName || "",
                                    },
                                });
                            }}
                        >
                            New Support
                        </Dropdown.Item>
                    )}

                    {privileges.includes('new-aed') && (
                        <Dropdown.Item
                            onClick={() => {
                                navigate("/account/new/aed/" + account_id);
                            }}
                        >
                            New AED
                        </Dropdown.Item>
                    )}

                </Dropdown.Menu>
            </Dropdown>
        </>
    )
}