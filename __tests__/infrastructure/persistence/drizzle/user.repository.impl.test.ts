import { describe, it, expect, vi, beforeEach } from "vitest";
import type {
	IUser,
	IProfile,
	UpdateUserDTO,
	CreateProfileDTO,
	UpdateProfileDTO,
} from "~/domain/user";

/**
 * infrastructure/persistence/drizzle/user.repository.impl.ts 유닛 테스트
 *
 * 테스트 대상:
 * - createUserRepositoryImpl: User Repository 구현체
 * - createProfileRepositoryImpl: Profile Repository 구현체
 *
 * Mock 전략: Drizzle Client를 Mock하여 DB 호출을 시뮬레이션
 */

describe("infrastructure/persistence/drizzle/user.repository.impl", () => {
	// Mock 사용자 데이터
	const mockUser: IUser = {
		id: "user-123",
		name: "Test User",
		email: "test@example.com",
		emailVerified: true,
		image: null,
		createdAt: new Date("2024-01-01"),
		updatedAt: new Date("2024-01-01"),
	};

	// Mock 프로필 데이터
	const mockProfile: IProfile = {
		id: "profile-123",
		userId: "user-123",
		fullName: "Test Full Name",
		avatarUrl: "https://example.com/avatar.jpg",
		bio: "Test bio",
		createdAt: new Date("2024-01-01"),
		updatedAt: new Date("2024-01-01"),
	};

	// Mock Drizzle Client
	let mockDb: {
		select: ReturnType<typeof vi.fn>;
		insert: ReturnType<typeof vi.fn>;
		update: ReturnType<typeof vi.fn>;
	};

	// 체이닝을 위한 Mock 빌더
	const createSelectMock = (result: unknown[]) => {
		const mock = {
			from: vi.fn().mockReturnThis(),
			leftJoin: vi.fn().mockReturnThis(),
			where: vi.fn().mockReturnThis(),
			limit: vi.fn().mockResolvedValue(result),
		};
		return mock;
	};

	const createInsertMock = (result: unknown[]) => {
		const mock = {
			values: vi.fn().mockReturnThis(),
			returning: vi.fn().mockResolvedValue(result),
		};
		return mock;
	};

	const createUpdateMock = (result: unknown[]) => {
		const mock = {
			set: vi.fn().mockReturnThis(),
			where: vi.fn().mockReturnThis(),
			returning: vi.fn().mockResolvedValue(result),
		};
		return mock;
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("createUserRepositoryImpl", () => {
		describe("findById", () => {
			it("사용자가 존재하면 사용자 정보를 반환한다", async () => {
				// Arrange
				const selectMock = createSelectMock([mockUser]);
				mockDb = {
					select: vi.fn().mockReturnValue(selectMock),
					insert: vi.fn(),
					update: vi.fn(),
				};

				const {
					createUserRepositoryImpl,
				} = await import(
					"~/infrastructure/persistence/drizzle/user.repository.impl"
				);
				const userRepository = createUserRepositoryImpl(
					mockDb as unknown as Parameters<typeof createUserRepositoryImpl>[0],
				);

				// Act
				const result = await userRepository.findById("user-123");

				// Assert
				expect(mockDb.select).toHaveBeenCalled();
				expect(result).toEqual(mockUser);
			});

			it("사용자가 존재하지 않으면 null을 반환한다", async () => {
				// Arrange
				const selectMock = createSelectMock([]);
				mockDb = {
					select: vi.fn().mockReturnValue(selectMock),
					insert: vi.fn(),
					update: vi.fn(),
				};

				const {
					createUserRepositoryImpl,
				} = await import(
					"~/infrastructure/persistence/drizzle/user.repository.impl"
				);
				const userRepository = createUserRepositoryImpl(
					mockDb as unknown as Parameters<typeof createUserRepositoryImpl>[0],
				);

				// Act
				const result = await userRepository.findById("non-existent");

				// Assert
				expect(result).toBeNull();
			});
		});

		describe("findByEmail", () => {
			it("사용자가 존재하면 사용자 정보를 반환한다", async () => {
				// Arrange
				const selectMock = createSelectMock([mockUser]);
				mockDb = {
					select: vi.fn().mockReturnValue(selectMock),
					insert: vi.fn(),
					update: vi.fn(),
				};

				const {
					createUserRepositoryImpl,
				} = await import(
					"~/infrastructure/persistence/drizzle/user.repository.impl"
				);
				const userRepository = createUserRepositoryImpl(
					mockDb as unknown as Parameters<typeof createUserRepositoryImpl>[0],
				);

				// Act
				const result = await userRepository.findByEmail("test@example.com");

				// Assert
				expect(mockDb.select).toHaveBeenCalled();
				expect(result).toEqual(mockUser);
			});

			it("사용자가 존재하지 않으면 null을 반환한다", async () => {
				// Arrange
				const selectMock = createSelectMock([]);
				mockDb = {
					select: vi.fn().mockReturnValue(selectMock),
					insert: vi.fn(),
					update: vi.fn(),
				};

				const {
					createUserRepositoryImpl,
				} = await import(
					"~/infrastructure/persistence/drizzle/user.repository.impl"
				);
				const userRepository = createUserRepositoryImpl(
					mockDb as unknown as Parameters<typeof createUserRepositoryImpl>[0],
				);

				// Act
				const result = await userRepository.findByEmail("non-existent@example.com");

				// Assert
				expect(result).toBeNull();
			});
		});

		describe("findWithProfile", () => {
			it("사용자와 프로필이 존재하면 함께 반환한다", async () => {
				// Arrange
				const selectMock = createSelectMock([
					{ user: mockUser, profiles: mockProfile },
				]);
				mockDb = {
					select: vi.fn().mockReturnValue(selectMock),
					insert: vi.fn(),
					update: vi.fn(),
				};

				const {
					createUserRepositoryImpl,
				} = await import(
					"~/infrastructure/persistence/drizzle/user.repository.impl"
				);
				const userRepository = createUserRepositoryImpl(
					mockDb as unknown as Parameters<typeof createUserRepositoryImpl>[0],
				);

				// Act
				const result = await userRepository.findWithProfile("user-123");

				// Assert
				expect(result).toEqual({
					...mockUser,
					profile: mockProfile,
				});
			});

			it("사용자만 존재하고 프로필이 없으면 profile이 null인 객체를 반환한다", async () => {
				// Arrange
				const selectMock = createSelectMock([
					{ user: mockUser, profiles: null },
				]);
				mockDb = {
					select: vi.fn().mockReturnValue(selectMock),
					insert: vi.fn(),
					update: vi.fn(),
				};

				const {
					createUserRepositoryImpl,
				} = await import(
					"~/infrastructure/persistence/drizzle/user.repository.impl"
				);
				const userRepository = createUserRepositoryImpl(
					mockDb as unknown as Parameters<typeof createUserRepositoryImpl>[0],
				);

				// Act
				const result = await userRepository.findWithProfile("user-123");

				// Assert
				expect(result?.profile).toBeNull();
			});

			it("사용자가 존재하지 않으면 null을 반환한다", async () => {
				// Arrange
				const selectMock = createSelectMock([]);
				mockDb = {
					select: vi.fn().mockReturnValue(selectMock),
					insert: vi.fn(),
					update: vi.fn(),
				};

				const {
					createUserRepositoryImpl,
				} = await import(
					"~/infrastructure/persistence/drizzle/user.repository.impl"
				);
				const userRepository = createUserRepositoryImpl(
					mockDb as unknown as Parameters<typeof createUserRepositoryImpl>[0],
				);

				// Act
				const result = await userRepository.findWithProfile("non-existent");

				// Assert
				expect(result).toBeNull();
			});
		});

		describe("update", () => {
			it("사용자 정보를 업데이트하고 결과를 반환한다", async () => {
				// Arrange
				const updatedUser = { ...mockUser, name: "Updated Name" };
				const updateMock = createUpdateMock([updatedUser]);
				mockDb = {
					select: vi.fn(),
					insert: vi.fn(),
					update: vi.fn().mockReturnValue(updateMock),
				};

				const {
					createUserRepositoryImpl,
				} = await import(
					"~/infrastructure/persistence/drizzle/user.repository.impl"
				);
				const userRepository = createUserRepositoryImpl(
					mockDb as unknown as Parameters<typeof createUserRepositoryImpl>[0],
				);

				const updateData: UpdateUserDTO = { name: "Updated Name" };

				// Act
				const result = await userRepository.update("user-123", updateData);

				// Assert
				expect(mockDb.update).toHaveBeenCalled();
				expect(result).toEqual(updatedUser);
			});

			it("사용자가 존재하지 않으면 에러를 던진다", async () => {
				// Arrange
				const updateMock = createUpdateMock([]);
				mockDb = {
					select: vi.fn(),
					insert: vi.fn(),
					update: vi.fn().mockReturnValue(updateMock),
				};

				const {
					createUserRepositoryImpl,
				} = await import(
					"~/infrastructure/persistence/drizzle/user.repository.impl"
				);
				const userRepository = createUserRepositoryImpl(
					mockDb as unknown as Parameters<typeof createUserRepositoryImpl>[0],
				);

				const updateData: UpdateUserDTO = { name: "Updated Name" };

				// Act & Assert
				await expect(
					userRepository.update("non-existent", updateData),
				).rejects.toThrow("사용자를 찾을 수 없습니다.");
			});
		});
	});

	describe("createProfileRepositoryImpl", () => {
		describe("findByUserId", () => {
			it("프로필이 존재하면 프로필 정보를 반환한다", async () => {
				// Arrange
				const selectMock = createSelectMock([mockProfile]);
				mockDb = {
					select: vi.fn().mockReturnValue(selectMock),
					insert: vi.fn(),
					update: vi.fn(),
				};

				const {
					createProfileRepositoryImpl,
				} = await import(
					"~/infrastructure/persistence/drizzle/user.repository.impl"
				);
				const profileRepository = createProfileRepositoryImpl(
					mockDb as unknown as Parameters<typeof createProfileRepositoryImpl>[0],
				);

				// Act
				const result = await profileRepository.findByUserId("user-123");

				// Assert
				expect(mockDb.select).toHaveBeenCalled();
				expect(result).toEqual(mockProfile);
			});

			it("프로필이 존재하지 않으면 null을 반환한다", async () => {
				// Arrange
				const selectMock = createSelectMock([]);
				mockDb = {
					select: vi.fn().mockReturnValue(selectMock),
					insert: vi.fn(),
					update: vi.fn(),
				};

				const {
					createProfileRepositoryImpl,
				} = await import(
					"~/infrastructure/persistence/drizzle/user.repository.impl"
				);
				const profileRepository = createProfileRepositoryImpl(
					mockDb as unknown as Parameters<typeof createProfileRepositoryImpl>[0],
				);

				// Act
				const result = await profileRepository.findByUserId("non-existent");

				// Assert
				expect(result).toBeNull();
			});
		});

		describe("create", () => {
			it("프로필을 생성하고 결과를 반환한다", async () => {
				// Arrange
				const insertMock = createInsertMock([mockProfile]);
				mockDb = {
					select: vi.fn(),
					insert: vi.fn().mockReturnValue(insertMock),
					update: vi.fn(),
				};

				const {
					createProfileRepositoryImpl,
				} = await import(
					"~/infrastructure/persistence/drizzle/user.repository.impl"
				);
				const profileRepository = createProfileRepositoryImpl(
					mockDb as unknown as Parameters<typeof createProfileRepositoryImpl>[0],
				);

				const createData: CreateProfileDTO = {
					userId: "user-123",
					fullName: "Test Full Name",
					avatarUrl: "https://example.com/avatar.jpg",
					bio: "Test bio",
				};

				// Act
				const result = await profileRepository.create(createData);

				// Assert
				expect(mockDb.insert).toHaveBeenCalled();
				expect(result).toEqual(mockProfile);
			});

			it("선택적 필드가 없어도 프로필을 생성한다", async () => {
				// Arrange
				const profileWithNulls: IProfile = {
					...mockProfile,
					fullName: null,
					avatarUrl: null,
					bio: null,
				};
				const insertMock = createInsertMock([profileWithNulls]);
				mockDb = {
					select: vi.fn(),
					insert: vi.fn().mockReturnValue(insertMock),
					update: vi.fn(),
				};

				const {
					createProfileRepositoryImpl,
				} = await import(
					"~/infrastructure/persistence/drizzle/user.repository.impl"
				);
				const profileRepository = createProfileRepositoryImpl(
					mockDb as unknown as Parameters<typeof createProfileRepositoryImpl>[0],
				);

				const createData: CreateProfileDTO = {
					userId: "user-123",
				};

				// Act
				const result = await profileRepository.create(createData);

				// Assert
				expect(result.fullName).toBeNull();
				expect(result.avatarUrl).toBeNull();
				expect(result.bio).toBeNull();
			});
		});

		describe("update", () => {
			it("프로필을 업데이트하고 결과를 반환한다", async () => {
				// Arrange
				const updatedProfile = { ...mockProfile, fullName: "Updated Name" };
				const updateMock = createUpdateMock([updatedProfile]);
				mockDb = {
					select: vi.fn(),
					insert: vi.fn(),
					update: vi.fn().mockReturnValue(updateMock),
				};

				const {
					createProfileRepositoryImpl,
				} = await import(
					"~/infrastructure/persistence/drizzle/user.repository.impl"
				);
				const profileRepository = createProfileRepositoryImpl(
					mockDb as unknown as Parameters<typeof createProfileRepositoryImpl>[0],
				);

				const updateData: UpdateProfileDTO = { fullName: "Updated Name" };

				// Act
				const result = await profileRepository.update("user-123", updateData);

				// Assert
				expect(mockDb.update).toHaveBeenCalled();
				expect(result).toEqual(updatedProfile);
			});

			it("프로필이 존재하지 않으면 에러를 던진다", async () => {
				// Arrange
				const updateMock = createUpdateMock([]);
				mockDb = {
					select: vi.fn(),
					insert: vi.fn(),
					update: vi.fn().mockReturnValue(updateMock),
				};

				const {
					createProfileRepositoryImpl,
				} = await import(
					"~/infrastructure/persistence/drizzle/user.repository.impl"
				);
				const profileRepository = createProfileRepositoryImpl(
					mockDb as unknown as Parameters<typeof createProfileRepositoryImpl>[0],
				);

				const updateData: UpdateProfileDTO = { fullName: "Updated Name" };

				// Act & Assert
				await expect(
					profileRepository.update("non-existent", updateData),
				).rejects.toThrow("프로필을 찾을 수 없습니다.");
			});
		});
	});
});
