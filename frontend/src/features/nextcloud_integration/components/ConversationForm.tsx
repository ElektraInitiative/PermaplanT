import React, { useState } from 'react';
import SimpleButton from '@/components/Button/SimpleButton';
import { ConversationType, createConversation, CreateConversationOptions } from '../api/chat';

const ConversationForm = () => {
  const [options, setOptions] = useState<CreateConversationOptions>({
    roomType: ConversationType.OneToOne,
    objectType: 'room',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setOptions((prevOptions) => ({
      ...prevOptions,
      [name]: value,
    }));
  };

  const submit = async () => {
    console.log(options);
    const response = await createConversation(options);
    console.log(response);
  };

  return (
    <form className="flex flex-col gap-2">
      <div className="flex gap-2">
        <label htmlFor="roomType">Room Type:</label>
        <select
          className="bg-neutral-700"
          id="roomType"
          name="roomType"
          value={options.roomType}
          onChange={handleChange}
        >
          <option value={ConversationType.OneToOne}>One to One</option>
          <option value={ConversationType.Group}>Group</option>
          <option value={ConversationType.Public}>Public</option>
          <option value={ConversationType.Changelog}>Changelog</option>
          <option value={ConversationType.FormerOneToOne}>Former One to One</option>
        </select>
      </div>

      <div className="flex gap-2">
        <label htmlFor="invite">Invite:</label>
        <input
          className="dark:bg-neutral-700"
          type="text"
          id="invite"
          name="invite"
          value={options.invite}
          onChange={handleChange}
        />
      </div>

      <div className="flex gap-2">
        <label htmlFor="source">Source:</label>
        <input
          className="dark:bg-neutral-700"
          type="text"
          id="source"
          name="source"
          value={options.source}
          onChange={handleChange}
        />
      </div>

      <div className="flex gap-2">
        <label htmlFor="roomName">Room Name:</label>
        <input
          className="dark:bg-neutral-700"
          type="text"
          id="roomName"
          name="roomName"
          value={options.roomName}
          onChange={handleChange}
        />
      </div>

      <div className="flex gap-2">
        <label htmlFor="objectId">Object ID:</label>
        <input
          className="dark:bg-neutral-700"
          type="text"
          id="objectId"
          name="objectId"
          value={options.objectId}
          onChange={handleChange}
        />
      </div>
      <SimpleButton onClick={submit}>Submit</SimpleButton>
    </form>
  );
};

export default ConversationForm;
