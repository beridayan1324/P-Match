import sequelize from '../db';
import User from '../models/User';
import Party from '../models/Party';
import PartyParticipant from '../models/PartyParticipant';
import bcrypt from 'bcryptjs';

async function seedTestParty() {
  try {
    await sequelize.authenticate();
    console.log('Connected to database');

    // Find admin user
    const admin = await User.findOne({ where: { email: 'admin@gmail.com' } });
    if (!admin) {
      console.error('Admin user not found. Run npm run seed:admin first!');
      process.exit(1);
    }

    // Create a test party (date is tomorrow, matching starts in 1 minute)
    const partyDate = new Date();
    partyDate.setDate(partyDate.getDate() + 1); // Tomorrow

    const matchingStartTime = new Date();
    matchingStartTime.setMinutes(matchingStartTime.getMinutes() + 1); // 1 minute from now

    const party = await Party.create({
      name: 'Test Party - Summer Beach Bash',
      date: partyDate,
      location: 'Santa Monica Beach, CA',
      description: 'Join us for an amazing beach party! Meet new people, dance, and have fun under the stars.',
      image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800',
      matchingStartTime,
      matchingStarted: false,
    });

    console.log(`✅ Created party: ${party.name}`);

    // Create 6 test users (3 males, 3 females)
    const testUsers: Array<{
      name: string;
      email: string;
      gender: 'male' | 'female' | 'other';
      genderPreference: 'male' | 'female' | 'any';
      bio: string;
      interests: string;
      location: string;
      profileImage: string;
    }> = [
      {
        name: 'John Smith',
        email: 'john@test.com',
        gender: 'male',
        genderPreference: 'female',
        bio: 'Love traveling and trying new restaurants. Always up for an adventure!',
        interests: JSON.stringify(['Travel', 'Food', 'Music']),
        location: 'Los Angeles, CA',
        profileImage: 'https://i.pravatar.cc/300?img=12',
      },
      {
        name: 'Michael Johnson',
        email: 'michael@test.com',
        gender: 'male',
        genderPreference: 'female',
        bio: 'Fitness enthusiast and coffee lover. Let\'s grab a coffee and chat!',
        interests: JSON.stringify(['Fitness', 'Coffee', 'Photography']),
        location: 'Los Angeles, CA',
        profileImage: 'https://i.pravatar.cc/300?img=13',
      },
      {
        name: 'David Lee',
        email: 'david@test.com',
        gender: 'male',
        genderPreference: 'female',
        bio: 'Software developer by day, guitarist by night. Love dogs and hiking.',
        interests: JSON.stringify(['Technology', 'Music', 'Hiking']),
        location: 'Los Angeles, CA',
        profileImage: 'https://i.pravatar.cc/300?img=14',
      },
      {
        name: 'Emily Davis',
        email: 'emily@test.com',
        gender: 'female',
        genderPreference: 'male',
        bio: 'Artist and yoga instructor. Looking for someone who loves deep conversations.',
        interests: JSON.stringify(['Art', 'Yoga', 'Books']),
        location: 'Los Angeles, CA',
        profileImage: 'https://i.pravatar.cc/300?img=10',
      },
      {
        name: 'Sarah Wilson',
        email: 'sarah@test.com',
        gender: 'female',
        genderPreference: 'male',
        bio: 'Marketing manager who loves concerts and beach days. Life is too short to be boring!',
        interests: JSON.stringify(['Music', 'Beach', 'Dancing']),
        location: 'Los Angeles, CA',
        profileImage: 'https://i.pravatar.cc/300?img=9',
      },
      {
        name: 'Jessica Brown',
        email: 'jessica@test.com',
        gender: 'female',
        genderPreference: 'male',
        bio: 'Foodie and traveler. Always planning my next adventure. Love trying new cuisines!',
        interests: JSON.stringify(['Travel', 'Food', 'Photography']),
        location: 'Los Angeles, CA',
        profileImage: 'https://i.pravatar.cc/300?img=5',
      },
    ];

    const hashedPassword = await bcrypt.hash('password123', 10);

    for (const userData of testUsers) {
      const user = await User.create({
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        gender: userData.gender,
        genderPreference: userData.genderPreference,
        bio: userData.bio,
        interests: userData.interests as any, // Add 'as any' to bypass TypeScript check
        location: userData.location,
        profileImage: userData.profileImage,
      });

      // Join the party
      await PartyParticipant.create({
        userId: user.id,
        partyId: party.id,
        optIn: true,
      });

      console.log(`✅ Created user: ${user.name} and joined party`);
    }

    // Admin also joins the party
    await PartyParticipant.create({
      userId: admin.id,
      partyId: party.id,
      optIn: true,
    });
    console.log(`✅ Admin joined the party`);

    console.log('\n🎉 Test party setup complete!');
    console.log(`Party ID: ${party.id}`);
    console.log(`Party Name: ${party.name}`);
    console.log(`Matching starts at: ${matchingStartTime.toLocaleString()}`);
    console.log(`Total participants: 7 (6 test users + admin)`);
    console.log('\nTest user credentials:');
    console.log('Email: john@test.com | Password: password123');
    console.log('Email: emily@test.com | Password: password123');
    console.log('(All test users have password: password123)');
    console.log('\nMatching will start in ~1 minute!');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding test party:', error);
    process.exit(1);
  }
}

seedTestParty();