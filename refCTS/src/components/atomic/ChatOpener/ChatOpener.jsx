import React from 'react';

const ChatOpener = () => {
	return (
		<form
			action="https://livehelp.cancer.gov/app/chat/chat_landing"
			method="post"
			target="Live_Assistance"
			className="inline-form"
			onSubmit={() => {
				return window.open(
					'about:blank',
					'Live_Assistance',
					'status=1,toolbar=0,menubar=0,location=0,resizable=1,height=750,width=660left=100,top=100'
				);
			}}>
			<input name="_icf_22" type="hidden" value="2174" />
			<button className="btnAsLink chat-link" type="submit">
				chat online
			</button>
		</form>
	);
};

export default ChatOpener;
