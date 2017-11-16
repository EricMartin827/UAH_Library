#!/usr/bin/perl -w

use strict;
use warnings;
use Getopt::Long;
use Pod::Usage;
#########################################
# Step 1
# Install cpanm
# For MacOS Users,
# brew install cpanminus
# ---
# Install cpanm
# For Linux Users,
# curl -L http://cpanmin.us | perl - --sudo App::cpanminus
# Step 2
# Install emailer module
# sudo cpanm Email::Send
# sudo cpanm Email::Send::Gmail
# sudo cpanm Email::Simple::Creator
#########################################
use Email::Send;
use Email::Send::Gmail;
use Email::Simple::Creator;

my $recipient_name;
my $recipient_email;
my $recipient_password;
my $opt_help;
my $opt_man;

GetOptions (
    "u=s"    => \$recipient_name,    # string
    "e=s"    => \$recipient_email,   # string
    "p=s"    => \$recipient_password, # string
    'help'   => \$opt_help,
    'man'    => \$opt_man,
) or pod2usage( "Try '$0 --help' for more information." );

pod2usage( -verbose => 1 ) if $opt_help;
pod2usage( -verbose => 2 ) if $opt_man;

unless( defined $recipient_name and defined $recipient_email ) {
    pod2usage( "Try perl $0 -u <recipient name> -e <recipient_email> -p <recipient_password>" );
}

my $subject = 'Welcome to UAH Library';
my $body = <<"TEXT";

Dear $recipient_name,

Your account is created. Please go to xxxxx.xxxxx.com to reset your password.

Your username: $recipient_email
Your password: $recipient_password

Best,

UAH Library Admin

TEXT

my $email = Email::Simple->create(
    header => [
        From    => 'UAHLibrary@gmail.com',
        To      => $recipient_email,
        Subject => $subject,
    ],
    body => $body,
);

my $sender = Email::Send->new(
    {
        mailer      => 'Gmail',
        mailer_args => [
            username => 'UAHLibrary@gmail.com',
            password => 'UAHLibrary123',
        ]
    }
);

eval { $sender->send($email) };
die "Error sending email: $@" if $@;
print "Email Sent Successfully\n";

=head1 EXAMPLES
  The following is an example of this script:
 welcome_email.pl -u recipient_name -e recipient@gmail.com -p 123456
=cut

=head1 OPTIONS
=over 8
=item B<-u> or B<--name>
Recipient Name
=item B<-e> or B<--email>
Recipient Email
=item B<-p> pr B<--password>
Recipient Password
=item B<--help>
Show the brief help information.
=item B<--man>
Read the manual, with examples.
=back
=cut
