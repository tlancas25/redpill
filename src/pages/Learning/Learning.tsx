import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import SEOHead from '../../components/shared/SEOHead';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { media } from '../../styles/breakpoints';
import { formatPrice, formatDuration } from '../../utils/helpers';

const LearningContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;

  ${media.tablet} {
    padding: 3rem 2rem;
  }
`;

const HeroSection = styled.section`
  text-align: center;
  padding: 3rem 0;
`;

const HeroTitle = styled.h1`
  font-family: ${({ theme }) => theme.fonts.heading};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 2rem;
  margin-bottom: 1rem;

  ${media.tablet} {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 1.1rem;
  max-width: 600px;
  margin: 0 auto;
`;

const SectionTitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.heading};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 1.5rem;
  margin: 3rem 0 1.5rem;
`;

const CourseGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;

  ${media.tablet} {
    grid-template-columns: repeat(2, 1fr);
  }

  ${media.desktop} {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const CourseThumbnail = styled.div`
  width: 100%;
  height: 160px;
  background: ${({ theme }) => theme.colors.surfaceLight};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  position: relative;
`;

const PlayOverlay = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(0, 255, 65, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
`;

const CourseTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.heading};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 1rem;
  margin-bottom: 0.5rem;
`;

const CourseMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 1rem;
`;

const DifficultyBadge = styled.span<{ $level: string }>`
  font-size: 0.625rem;
  padding: 0.2rem 0.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: ${({ $level }) => {
    switch ($level) {
      case 'Beginner': return 'rgba(0, 255, 65, 0.15)';
      case 'Intermediate': return 'rgba(255, 204, 0, 0.15)';
      case 'Advanced': return 'rgba(255, 51, 51, 0.15)';
      default: return 'rgba(0, 255, 65, 0.15)';
    }
  }};
  color: ${({ $level }) => {
    switch ($level) {
      case 'Beginner': return '#00ff41';
      case 'Intermediate': return '#ffcc00';
      case 'Advanced': return '#ff3333';
      default: return '#00ff41';
    }
  }};
`;

const PriceRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Price = styled.span`
  font-family: ${({ theme }) => theme.fonts.heading};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1.25rem;
`;

const sampleCourses = [
  {
    id: '1',
    title: 'Complete Cybersecurity Bootcamp',
    slug: 'cybersecurity-bootcamp',
    description: 'From zero to cyber-warrior in 30 lessons.',
    thumbnail: '',
    instructor: 'RedPill Academy',
    price: 49.99,
    category: 'Cybersecurity',
    difficulty: 'Beginner' as const,
    totalDuration: 720,
    lessonCount: 30,
    enrolledCount: 234,
    rating: 4.8,
  },
  {
    id: '2',
    title: 'Advanced Credit Engineering',
    slug: 'advanced-credit-engineering',
    description: 'Master the credit system and build financial freedom.',
    thumbnail: '',
    instructor: 'RedPill Academy',
    price: 59.99,
    category: 'Credit Repair',
    difficulty: 'Intermediate' as const,
    totalDuration: 480,
    lessonCount: 20,
    enrolledCount: 189,
    rating: 4.9,
  },
  {
    id: '3',
    title: 'Tech Mastery: Digital Survival',
    slug: 'tech-mastery-digital-survival',
    description: 'Essential tech skills for the modern world.',
    thumbnail: '',
    instructor: 'RedPill Academy',
    price: 39.99,
    category: 'Tech Mastery',
    difficulty: 'Beginner' as const,
    totalDuration: 360,
    lessonCount: 15,
    enrolledCount: 156,
    rating: 4.7,
  },
];

const Learning: React.FC = () => {
  return (
    <>
      <SEOHead title="Learn" description="Enter The Construct - Video courses on cybersecurity, credit repair, and tech mastery." />

      <LearningContainer>
        <HeroSection>
          <HeroTitle>Enter The Construct</HeroTitle>
          <HeroSubtitle>Your Learning Dashboard — Master the skills that matter.</HeroSubtitle>
        </HeroSection>

        <SectionTitle>Featured Courses</SectionTitle>
        <CourseGrid>
          {sampleCourses.map((course) => (
            <Link key={course.id} to={`/learn/course/${course.slug}`} style={{ textDecoration: 'none' }}>
              <Card hoverable>
                <CourseThumbnail>
                  🎬
                  <PlayOverlay>▶</PlayOverlay>
                </CourseThumbnail>
                <CourseTitle>{course.title}</CourseTitle>
                <CourseMeta>
                  <span>{course.instructor}</span>
                  <span>·</span>
                  <span>{formatDuration(course.totalDuration)}</span>
                  <span>·</span>
                  <span>{course.lessonCount} lessons</span>
                </CourseMeta>
                <DifficultyBadge $level={course.difficulty}>
                  {course.difficulty}
                </DifficultyBadge>
                <PriceRow>
                  <Price>{formatPrice(course.price)}</Price>
                  <Button size="sm">Enroll Now</Button>
                </PriceRow>
              </Card>
            </Link>
          ))}
        </CourseGrid>
      </LearningContainer>
    </>
  );
};

export default Learning;
