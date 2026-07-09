import { RecordSchema } from '@orbit/records';

export const schema = new RecordSchema({
	models: {
		users: {
			keys: { remoteId: {} },
			attributes: {
				roleId: { type: 'number' },
				name: { type: 'string' },
				photo: { type: 'string' },
				phone: { type: 'string' },
				email: { type: 'string' },
				instagram: { type: 'string' },
				facebook: { type: 'string' },
				address: { type: 'string' },
				telegram: { type: 'string' },
				timezone: { type: 'string' },
				createdAt: { type: 'string' },
				updatedAt: { type: 'string' }
			},
			relationships: {
				orderDesigns: { kind: 'hasMany', type: 'orderDesigns' },
				userLocation: { kind: 'hasOne', type: 'userLocations', inverse: 'user' }
			}
		},
		userLocations: {
			keys: { remoteId: {} },
			attributes: {
				userId: { type: 'number' },
				latitude: { type: 'number' },
				longitude: { type: 'number' },
				createdAt: { type: 'string' },
				updatedAt: { type: 'string' },
				deletedAt: { type: 'string' }
			},
			relationships: {
				user: { kind: 'hasOne', type: 'users', inverse: 'userLocation' }
			}
		},
		images: {
			keys: { remoteId: {} },
			attributes: {
				imageableType: { type: 'string' },
				imageableId: { type: 'number' },
				url: { type: 'string' },
				type: { type: 'string' },
				createdAt: { type: 'string' },
				updatedAt: { type: 'string' }
			},
			relationships: {
				orderDesign: { kind: 'hasOne', type: 'orderDesigns' }
			}
		},
		videos: {
			keys: { remoteId: {} },
			attributes: {
				videoableType: { type: 'string' },
				videoableId: { type: 'number' },
				url: { type: 'string' },
				type: { type: 'string' },
				createdAt: { type: 'string' },
				updatedAt: { type: 'string' }
			}
		},
		documents: {
			keys: { remoteId: {} },
			attributes: {
				documentableType: { type: 'string' },
				documentableId: { type: 'number' },
				url: { type: 'string' },
				type: { type: 'string' },
				createdAt: { type: 'string' },
				updatedAt: { type: 'string' }
			}
		},
		orderDesigns: {
			keys: { remoteId: {} },
			attributes: {
				invoiceId: { type: 'string' },
				userId: { type: 'number' },
				areaSize: { type: 'number' },
				areaPhotos: { type: 'array' },
				address: { type: 'string' },
				designerId: { type: 'number' },
				designFinishId: { type: 'number' },
				rating: { type: 'number' },
				testimony: { type: 'string' },
				status: { type: 'string' },
				price: { type: 'number' },
				promoCodeId: { type: 'number' },
				provinceId: { type: 'number' },
				cityId: { type: 'number' },
				totalPromo: { type: 'number' },
				categorySizeId: { type: 'number' },
				revision: { type: 'string' },
				paymentLink: { type: 'string' },
				groupClientUrl: { type: 'string' },
				groupInternalUrl: { type: 'string' },
				clientNote: { type: 'string' },
				presentationFileUrl: { type: 'string' },
				orderGardenId: { type: 'number' },
				consultationDate: { type: 'string' },
				consultationTime: { type: 'string' },
				poSchemeId: { type: 'number' },
				parentId: { type: 'number' },
				designCount: { type: 'number' },
				createdAt: { type: 'string' },
				updatedAt: { type: 'string' }
			},
			relationships: {
				user: { kind: 'hasOne', type: 'users', inverse: 'orderDesigns' },
				designer: { kind: 'hasOne', type: 'designers', inverse: 'orderDesigns' },
				inspirationPhotos: { kind: 'hasMany', type: 'images', inverse: 'orderDesign' },
				locationSurveyAssignment: {
					kind: 'hasOne',
					type: 'locationSurveyAssignments',
					inverse: 'orderDesign'
				}
			}
		},
		designs: {
			keys: { remoteId: {} },
			attributes: {
				typeId: { type: 'number' },
				categorySizeId: { type: 'number' },
				userId: { type: 'number' },
				designName: { type: 'string' },
				area: { type: 'string' },
				absortion: { type: 'string' },
				imageF: { type: 'string' },
				imageB: { type: 'string' },
				imageR: { type: 'string' },
				imageL: { type: 'string' },
				image5: { type: 'string' },
				image6: { type: 'string' },
				price: { type: 'number' },
				nursing: { type: 'string' },
				description: { type: 'string' },
				status: { type: 'string' },
				display: { type: 'number' },
				presentationFileLink: { type: 'string' },
				parentId: { type: 'number' },
				deletedAt: { type: 'string' },
				createdAt: { type: 'string' },
				updatedAt: { type: 'string' }
			},
			relationships: {
				orderDesign: { kind: 'hasMany', type: 'orderDesigns', inverse: 'design' }
			}
		},
		locationSurveyAssignments: {
			keys: { remoteId: {} },
			attributes: {
				orderDesignId: { type: 'number' },
				surveyorAvailabilityId: { type: 'number' },
				checkInAt: { type: 'string' },
				checkOutAt: { type: 'string' },
				status: { type: 'string' },
				createdAt: { type: 'string' },
				updatedAt: { type: 'string' }
			},
			relationships: {
				orderDesign: {
					kind: 'hasOne',
					type: 'orderDesigns',
					inverse: 'locationSurveyAssignment'
				},
				surveyorAvailability: {
					kind: 'hasOne',
					type: 'surveyorAvailabilities',
					inverse: 'locationSurveyAssignment'
				},
				designSurveyReports: {
					kind: 'hasMany',
					type: 'designSurveyReports',
					inverse: 'locationSurveyAssignment'
				}
			}
		},
		surveyorAvailabilities: {
			keys: { remoteId: {} },
			attributes: {
				surveyorId: { type: 'number' },
				availableAt: { type: 'string' },
				createdAt: { type: 'string' },
				updatedAt: { type: 'string' },
				deletedAt: { type: 'string' }
			},
			relationships: {
				surveyor: { kind: 'hasOne', type: 'users' },
				locationSurveyAssignment: {
					kind: 'hasOne',
					type: 'locationSurveyAssignments',
					inverse: 'surveyorAvailability'
				}
			}
		},
		designSurveyReports: {
			keys: { remoteId: {} },
			attributes: {
				locationSurveyAssignmentId: { type: 'number' },
				gardenName: { type: 'string' },
				areaSize: { type: 'number' },
				gardenFacingDirectionId: { type: 'number' },
				drainageId: { type: 'number' },
				plantPresenceId: { type: 'number' },
				waterSourceId: { type: 'number' },
				electricitySourceId: { type: 'number' },
				entranceAccessId: { type: 'number' },
				soilMoistureId: { type: 'number' },
				soilPlantingReadinessId: { type: 'number' },
				groundSurfaceConditionId: { type: 'number' },
				careLevelId: { type: 'number' },
				specialAreaId: { type: 'number' },
				gardenThemeId: { type: 'number' },
				specialAreaOtherText: { type: 'string' },
				surveyorNote: { type: 'string' },
				// Index tab taman ("0", "1", dst) di SurveyFormPage.tsx saat
				// laporan ini disubmit — dipakai untuk mencocokkan laporan ke
				// tab taman yang benar saat form dibuka kembali.
				clientEntryIndex: { type: 'string' },
				// Payload mentah lengkap (semua field Tahap 1 & Tahap 2) hasil
				// submit, disimpan sebagai JSON string supaya bisa dipulihkan
				// utuh saat form dibuka kembali (mis. status `incomplete`).
				rawFormData: { type: 'string' },
				createdAt: { type: 'string' },
				updatedAt: { type: 'string' }
			},
			relationships: {
				locationSurveyAssignment: {
					kind: 'hasOne',
					type: 'locationSurveyAssignments'
				},
				gardenFacingDirection: { kind: 'hasOne', type: 'tags' },
				areaSunExposure: { kind: 'hasOne', type: 'tags' },
				drainage: { kind: 'hasOne', type: 'tags' },
				plantPresence: { kind: 'hasOne', type: 'tags' },
				waterSource: { kind: 'hasOne', type: 'tags' },
				electricitySource: { kind: 'hasOne', type: 'tags' },
				entranceAccess: { kind: 'hasOne', type: 'tags' },
				soilMoisture: { kind: 'hasOne', type: 'tags' },
				soilPlantingReadiness: { kind: 'hasOne', type: 'tags' },
				groundSurfaceCondition: { kind: 'hasOne', type: 'tags' },
				careLevel: { kind: 'hasOne', type: 'tags' },
				specialArea: { kind: 'hasOne', type: 'tags' },
				gardenTheme: { kind: 'hasOne', type: 'tags' },
				sketchDocument: { kind: 'hasOne', type: 'documents' },
				sketchImage: { kind: 'hasOne', type: 'images' },
				documentationDocuments: { kind: 'hasMany', type: 'documents' },
				documentationImages: { kind: 'hasMany', type: 'images' },
				design: { kind: 'hasOne', type: 'designs' }
			}
		},
		tags: {
			keys: { remoteId: {} },
			attributes: {
				type: { type: 'string' },
				title: { type: 'string' },
				technicalNote: { type: 'string' },
				// Urutan tampil pilihan jawaban (sesuai urutan definisi di
				// dummyData.js) — dipakai useTagsQuery untuk sort, menggantikan
				// sort by numeric id yang salah untuk tag ber-id eksplisit rendah.
				order: { type: 'number' },
				createdAt: { type: 'string' },
				updatedAt: { type: 'string' }
			}
		},
		dateTimes: {
			keys: { remoteId: {} },
			attributes: {
				date_time_for: { type: 'string' },
				datetime: { type: 'string' },
				datetimeable_type: { type: 'string' },
				datetimeable_id: { type: 'number' },
				createdAt: { type: 'string' },
				updatedAt: { type: 'string' }
			}
		},
		addressComponents: {
			keys: { remoteId: {} },
			attributes: {
				addressComponentableId: { type: 'number' },
				addressComponentableType: { type: 'string' },
				geocoder: { type: 'string' },
				latitude: { type: 'number' },
				longitude: { type: 'number' },
				country: { type: 'string' },
				administrativeAreaLevel1: { type: 'string' },
				administrativeAreaLevel2: { type: 'string' },
				administrativeAreaLevel3: { type: 'string' },
				administrativeAreaLevel4: { type: 'string' },
				postalCode: { type: 'string' },
				fullAddress: { type: 'string' },
				createdAt: { type: 'string' },
				updatedAt: { type: 'string' }
			}
		}
	}
});