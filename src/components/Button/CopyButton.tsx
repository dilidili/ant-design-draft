import CopyToClipboard from 'react-copy-to-clipboard';
import React, { useState } from 'react';
import { Tooltip, Icon } from 'antd';

type CopyButtonProps = {
  text: string;
  className?: string;
}

const CopyButton = ({ text, className }: CopyButtonProps) => {
  const [ copied, setCopied ] = useState(false);
  const [ copyTooltipVisible, setTooltipVisible ] = useState(false);

  return (
    <CopyToClipboard text={text} onCopy={() => setCopied(true)}>
      <Tooltip
        visible={copyTooltipVisible}
        onVisibleChange={(visible) => {
          if (visible) {
            setCopied(false);
          }

          setTooltipVisible(visible);
        }}
        title={copied ? 'copied' : 'copy'}
      >
        <Icon
          type={copied && copyTooltipVisible ? 'check' : 'snippets'}
          className={className}
        />
      </Tooltip>
    </CopyToClipboard>
  )
}

export default CopyButton;