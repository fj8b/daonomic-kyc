// @flow
import * as React from 'react';
import cn from 'classnames';
import Button from '@daonomic/ui/source/button';
import Input from '@daonomic/ui/source/input';
import Panel from '@daonomic/ui/source/panel';
import Translation from '~/components/translation';
import Heading from '~/components/heading';
import Link from '~/components/link';
import textStyles from '~/components/text/text.css';
import Layout from '../layout';
import commonStyles from '../common.css';

type Props = {
  isLoading: boolean,
  email?: string,
  error: string,
  isRegistered: boolean,
  onSubmit: (event: Event) => void,
  onChangeEmail: (event: Event) => void,
};

export default class SignUp extends React.Component<Props, {}> {
  static defaultProps = {
    email: '',
  };

  renderForm = () => {
    const {
      isLoading,
      email,
      error,
      onSubmit,
      onChangeEmail,
      isRegistered,
    } = this.props;

    if (isRegistered) {
      return null;
    }

    return (
      <form onSubmit={onSubmit}>
        <Heading size="large" tagName="h1" className={commonStyles.title}>
          <Translation id="auth:signUpHeading" />
        </Heading>

        <div className={commonStyles.row}>
          <Input
            required
            value={email}
            type="email"
            label={Translation.text('auth:email')}
            error={error}
            onChange={onChangeEmail}
            disabled={isLoading}
          />
        </div>

        <div className={commonStyles.footer}>
          <Button type="submit" disabled={isLoading}>
            <Translation id="auth:signUpSubmit" />
          </Button>
        </div>
      </form>
    );
  };

  renderSuccessMessage = () => {
    const { isRegistered } = this.props;

    if (!isRegistered) {
      return null;
    }

    return (
      <p className={cn(textStyles.muted, textStyles.center)}>
        <Translation id="auth:signUpSuccess" />
      </p>
    );
  };

  render = () => (
    <Layout>
      <Panel paddingSize="large">
        {this.renderForm()}
        {this.renderSuccessMessage()}
      </Panel>

      <Panel className={cn(textStyles.muted, textStyles.center)}>
        <Translation id="auth:alreadyHaveAccount" />{' '}
        <Link href="/sign/in">
          <Translation id="auth:signInHeading" />&nbsp;⟩
        </Link>
      </Panel>
    </Layout>
  );
}
