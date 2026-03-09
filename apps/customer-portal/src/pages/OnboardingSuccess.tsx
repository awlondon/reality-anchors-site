import { Link } from 'react-router-dom';
import { Card, Button } from '../components/ui';

export default function OnboardingSuccess() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md w-full text-center">
        <div className="text-4xl mb-4">+</div>
        <h1 className="text-2xl font-semibold text-txt mb-2">You're all set!</h1>
        <p className="text-muted mb-6">
          Your subscription has been activated and your organization is being provisioned. You'll be ready to go in a moment.
        </p>
        <Link to="/">
          <Button className="w-full">Go to Dashboard</Button>
        </Link>
      </Card>
    </div>
  );
}
