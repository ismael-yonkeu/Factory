# Architecture de l'Application Mobile Flutter

Ce document détaille l'architecture de l'application mobile Flutter pour la collecte de données terrain.

## Vue d'ensemble

L'application mobile offre les mêmes fonctionnalités que l'application web terrain, avec des optimisations spécifiques pour mobile et une meilleure gestion du mode offline.

## Structure du Projet

```
mobile_app/
├── lib/
│   ├── main.dart                        # Point d'entrée
│   │
│   ├── app/                             # Configuration de l'app
│   │   ├── app.dart
│   │   ├── routes.dart
│   │   └── theme.dart
│   │
│   ├── core/                            # Éléments centraux
│   │   ├── constants/
│   │   │   ├── api_constants.dart
│   │   │   ├── storage_keys.dart
│   │   │   └── app_constants.dart
│   │   │
│   │   ├── errors/
│   │   │   ├── exceptions.dart
│   │   │   └── failures.dart
│   │   │
│   │   ├── network/
│   │   │   ├── api_client.dart
│   │   │   ├── network_info.dart
│   │   │   └── interceptors/
│   │   │       ├── auth_interceptor.dart
│   │   │       └── logging_interceptor.dart
│   │   │
│   │   ├── storage/
│   │   │   ├── local_storage.dart
│   │   │   ├── secure_storage.dart
│   │   │   └── database/
│   │   │       ├── app_database.dart
│   │   │       ├── daos/
│   │   │       └── models/
│   │   │
│   │   └── utils/
│   │       ├── date_formatter.dart
│   │       ├── validators.dart
│   │       ├── image_compressor.dart
│   │       └── permission_handler.dart
│   │
│   ├── features/                        # Fonctionnalités
│   │   │
│   │   ├── auth/                        # Authentification
│   │   │   ├── data/
│   │   │   │   ├── datasources/
│   │   │   │   │   ├── auth_local_datasource.dart
│   │   │   │   │   └── auth_remote_datasource.dart
│   │   │   │   ├── models/
│   │   │   │   │   ├── user_model.dart
│   │   │   │   │   └── auth_response_model.dart
│   │   │   │   └── repositories/
│   │   │   │       └── auth_repository_impl.dart
│   │   │   │
│   │   │   ├── domain/
│   │   │   │   ├── entities/
│   │   │   │   │   └── user.dart
│   │   │   │   ├── repositories/
│   │   │   │   │   └── auth_repository.dart
│   │   │   │   └── usecases/
│   │   │   │       ├── login.dart
│   │   │   │       ├── logout.dart
│   │   │   │       └── get_current_user.dart
│   │   │   │
│   │   │   └── presentation/
│   │   │       ├── bloc/
│   │   │       │   ├── auth_bloc.dart
│   │   │       │   ├── auth_event.dart
│   │   │       │   └── auth_state.dart
│   │   │       ├── pages/
│   │   │       │   ├── login_page.dart
│   │   │       │   └── splash_page.dart
│   │   │       └── widgets/
│   │   │           ├── login_form.dart
│   │   │           └── password_field.dart
│   │   │
│   │   ├── assignments/                 # Tâches assignées
│   │   │   ├── data/
│   │   │   │   ├── datasources/
│   │   │   │   ├── models/
│   │   │   │   └── repositories/
│   │   │   ├── domain/
│   │   │   │   ├── entities/
│   │   │   │   ├── repositories/
│   │   │   │   └── usecases/
│   │   │   └── presentation/
│   │   │       ├── bloc/
│   │   │       ├── pages/
│   │   │       │   ├── assignment_list_page.dart
│   │   │       │   └── assignment_detail_page.dart
│   │   │       └── widgets/
│   │   │           ├── assignment_card.dart
│   │   │           └── assignment_filter.dart
│   │   │
│   │   ├── collection/                  # Collecte de données
│   │   │   ├── data/
│   │   │   │   ├── datasources/
│   │   │   │   │   ├── collection_local_datasource.dart
│   │   │   │   │   └── collection_remote_datasource.dart
│   │   │   │   ├── models/
│   │   │   │   │   ├── checklist_model.dart
│   │   │   │   │   ├── field_model.dart
│   │   │   │   │   └── collection_model.dart
│   │   │   │   └── repositories/
│   │   │   │       └── collection_repository_impl.dart
│   │   │   │
│   │   │   ├── domain/
│   │   │   │   ├── entities/
│   │   │   │   │   ├── checklist.dart
│   │   │   │   │   ├── field.dart
│   │   │   │   │   └── collection.dart
│   │   │   │   ├── repositories/
│   │   │   │   │   └── collection_repository.dart
│   │   │   │   └── usecases/
│   │   │   │       ├── get_checklist.dart
│   │   │   │       ├── save_draft.dart
│   │   │   │       ├── submit_collection.dart
│   │   │   │       └── upload_attachment.dart
│   │   │   │
│   │   │   └── presentation/
│   │   │       ├── bloc/
│   │   │       │   ├── collection_bloc.dart
│   │   │       │   ├── collection_event.dart
│   │   │       │   └── collection_state.dart
│   │   │       ├── pages/
│   │   │       │   ├── collection_page.dart
│   │   │       │   └── review_page.dart
│   │   │       └── widgets/
│   │   │           ├── field_renderer/
│   │   │           │   ├── text_field_widget.dart
│   │   │           │   ├── number_field_widget.dart
│   │   │           │   ├── select_field_widget.dart
│   │   │           │   ├── photo_field_widget.dart
│   │   │           │   ├── signature_field_widget.dart
│   │   │           │   └── location_field_widget.dart
│   │   │           ├── form_progress_bar.dart
│   │   │           └── section_header.dart
│   │   │
│   │   ├── sync/                        # Synchronisation
│   │   │   ├── data/
│   │   │   │   ├── datasources/
│   │   │   │   ├── models/
│   │   │   │   └── repositories/
│   │   │   ├── domain/
│   │   │   │   ├── entities/
│   │   │   │   ├── repositories/
│   │   │   │   └── usecases/
│   │   │   │       ├── sync_pending_data.dart
│   │   │   │       ├── resolve_conflict.dart
│   │   │   │       └── check_sync_status.dart
│   │   │   └── presentation/
│   │   │       ├── bloc/
│   │   │       └── widgets/
│   │   │           ├── sync_indicator.dart
│   │   │           └── conflict_resolver.dart
│   │   │
│   │   └── profile/                     # Profil utilisateur
│   │       ├── data/
│   │       ├── domain/
│   │       └── presentation/
│   │           ├── bloc/
│   │           ├── pages/
│   │           │   └── profile_page.dart
│   │           └── widgets/
│   │
│   ├── shared/                          # Widgets partagés
│   │   ├── widgets/
│   │   │   ├── buttons/
│   │   │   │   ├── primary_button.dart
│   │   │   │   └── secondary_button.dart
│   │   │   ├── inputs/
│   │   │   │   ├── custom_text_field.dart
│   │   │   │   └── custom_dropdown.dart
│   │   │   ├── cards/
│   │   │   │   └── custom_card.dart
│   │   │   ├── dialogs/
│   │   │   │   ├── confirm_dialog.dart
│   │   │   │   └── error_dialog.dart
│   │   │   ├── loading/
│   │   │   │   └── loading_indicator.dart
│   │   │   └── offline/
│   │   │       └── offline_banner.dart
│   │   │
│   │   └── extensions/
│   │       ├── context_extensions.dart
│   │       ├── string_extensions.dart
│   │       └── date_extensions.dart
│   │
│   └── injection_container.dart         # Dependency Injection
│
├── test/                                # Tests
│   ├── unit/
│   ├── widget/
│   └── integration/
│
├── android/                             # Configuration Android
├── ios/                                 # Configuration iOS
│
├── assets/                              # Assets
│   ├── images/
│   ├── icons/
│   └── fonts/
│
├── pubspec.yaml                         # Dépendances
└── README.md
```

## Architecture Clean Architecture + BLoC

### Couches

```
┌─────────────────────────────────────────────────────────────────┐
│                        PRESENTATION                              │
│  - Pages (UI)                                                    │
│  - Widgets                                                       │
│  - BLoC (Business Logic Component)                              │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                          DOMAIN                                  │
│  - Entities (Objets métier purs)                                │
│  - Use Cases (Logique métier)                                   │
│  - Repository Interfaces                                        │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                           DATA                                   │
│  - Models (Sérialisation)                                       │
│  - Repository Implementations                                   │
│  - Data Sources (Remote + Local)                               │
└─────────────────────────────────────────────────────────────────┘
```

## Exemples de Code

### 1. Entité Domain (Entity)

```dart
// lib/features/collection/domain/entities/checklist.dart
class Checklist {
  final String id;
  final String title;
  final String description;
  final List<ChecklistSection> sections;
  final String frequency;
  final int? estimatedDuration;

  Checklist({
    required this.id,
    required this.title,
    required this.description,
    required this.sections,
    required this.frequency,
    this.estimatedDuration,
  });
}

class ChecklistSection {
  final String id;
  final String title;
  final String? description;
  final List<FieldDefinition> fields;
  final int orderIndex;

  ChecklistSection({
    required this.id,
    required this.title,
    this.description,
    required this.fields,
    required this.orderIndex,
  });
}

class FieldDefinition {
  final String id;
  final FieldType type;
  final String label;
  final String? placeholder;
  final String? helpText;
  final bool isRequired;
  final Map<String, dynamic>? validationRules;
  final List<FieldOption>? options;

  FieldDefinition({
    required this.id,
    required this.type,
    required this.label,
    this.placeholder,
    this.helpText,
    required this.isRequired,
    this.validationRules,
    this.options,
  });
}

enum FieldType {
  text,
  number,
  email,
  phone,
  textarea,
  select,
  multiSelect,
  checkbox,
  radio,
  date,
  time,
  datetime,
  photo,
  signature,
  location,
}
```

### 2. Use Case

```dart
// lib/features/collection/domain/usecases/submit_collection.dart
import 'package:dartz/dartz.dart';
import '../entities/collection.dart';
import '../repositories/collection_repository.dart';
import '../../../../core/errors/failures.dart';

class SubmitCollection {
  final CollectionRepository repository;

  SubmitCollection(this.repository);

  Future<Either<Failure, void>> call(String collectionId) async {
    return await repository.submitCollection(collectionId);
  }
}
```

### 3. Repository Interface

```dart
// lib/features/collection/domain/repositories/collection_repository.dart
import 'package:dartz/dartz.dart';
import '../entities/checklist.dart';
import '../entities/collection.dart';
import '../../../../core/errors/failures.dart';

abstract class CollectionRepository {
  Future<Either<Failure, Checklist>> getChecklist(String checklistId);
  Future<Either<Failure, Collection>> createCollection(String assignmentId);
  Future<Either<Failure, void>> updateFieldValue(
    String collectionId,
    String fieldId,
    dynamic value,
  );
  Future<Either<Failure, void>> saveDraft(String collectionId);
  Future<Either<Failure, void>> submitCollection(String collectionId);
  Future<Either<Failure, String>> uploadAttachment(
    String collectionId,
    String fieldId,
    String filePath,
  );
}
```

### 4. Model (Implémentation Data)

```dart
// lib/features/collection/data/models/checklist_model.dart
import '../../domain/entities/checklist.dart';

class ChecklistModel extends Checklist {
  ChecklistModel({
    required String id,
    required String title,
    required String description,
    required List<ChecklistSectionModel> sections,
    required String frequency,
    int? estimatedDuration,
  }) : super(
          id: id,
          title: title,
          description: description,
          sections: sections,
          frequency: frequency,
          estimatedDuration: estimatedDuration,
        );

  factory ChecklistModel.fromJson(Map<String, dynamic> json) {
    return ChecklistModel(
      id: json['id'],
      title: json['title'],
      description: json['description'] ?? '',
      sections: (json['sections'] as List)
          .map((s) => ChecklistSectionModel.fromJson(s))
          .toList(),
      frequency: json['frequency'],
      estimatedDuration: json['estimated_duration'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'description': description,
      'sections': sections.map((s) => (s as ChecklistSectionModel).toJson()).toList(),
      'frequency': frequency,
      'estimated_duration': estimatedDuration,
    };
  }
}
```

### 5. BLoC

```dart
// lib/features/collection/presentation/bloc/collection_bloc.dart
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';
import '../../domain/entities/checklist.dart';
import '../../domain/entities/collection.dart';
import '../../domain/usecases/get_checklist.dart';
import '../../domain/usecases/submit_collection.dart';

// Events
abstract class CollectionEvent extends Equatable {
  @override
  List<Object?> get props => [];
}

class LoadChecklist extends CollectionEvent {
  final String checklistId;
  LoadChecklist(this.checklistId);
  @override
  List<Object?> get props => [checklistId];
}

class UpdateField extends CollectionEvent {
  final String fieldId;
  final dynamic value;
  UpdateField(this.fieldId, this.value);
  @override
  List<Object?> get props => [fieldId, value];
}

class SaveDraft extends CollectionEvent {}

class SubmitCollectionEvent extends CollectionEvent {}

// States
abstract class CollectionState extends Equatable {
  @override
  List<Object?> get props => [];
}

class CollectionInitial extends CollectionState {}

class CollectionLoading extends CollectionState {}

class CollectionLoaded extends CollectionState {
  final Checklist checklist;
  final Collection collection;
  final Map<String, dynamic> fieldValues;

  CollectionLoaded({
    required this.checklist,
    required this.collection,
    required this.fieldValues,
  });

  @override
  List<Object?> get props => [checklist, collection, fieldValues];

  CollectionLoaded copyWith({
    Checklist? checklist,
    Collection? collection,
    Map<String, dynamic>? fieldValues,
  }) {
    return CollectionLoaded(
      checklist: checklist ?? this.checklist,
      collection: collection ?? this.collection,
      fieldValues: fieldValues ?? this.fieldValues,
    );
  }
}

class CollectionError extends CollectionState {
  final String message;
  CollectionError(this.message);
  @override
  List<Object?> get props => [message];
}

class CollectionSubmitted extends CollectionState {}

// BLoC
class CollectionBloc extends Bloc<CollectionEvent, CollectionState> {
  final GetChecklist getChecklist;
  final SubmitCollection submitCollection;

  CollectionBloc({
    required this.getChecklist,
    required this.submitCollection,
  }) : super(CollectionInitial()) {
    on<LoadChecklist>(_onLoadChecklist);
    on<UpdateField>(_onUpdateField);
    on<SaveDraft>(_onSaveDraft);
    on<SubmitCollectionEvent>(_onSubmitCollection);
  }

  Future<void> _onLoadChecklist(
    LoadChecklist event,
    Emitter<CollectionState> emit,
  ) async {
    emit(CollectionLoading());
    
    final result = await getChecklist(event.checklistId);
    
    result.fold(
      (failure) => emit(CollectionError(failure.message)),
      (checklist) => emit(CollectionLoaded(
        checklist: checklist,
        collection: Collection.empty(),
        fieldValues: {},
      )),
    );
  }

  Future<void> _onUpdateField(
    UpdateField event,
    Emitter<CollectionState> emit,
  ) async {
    if (state is CollectionLoaded) {
      final currentState = state as CollectionLoaded;
      final updatedValues = Map<String, dynamic>.from(currentState.fieldValues);
      updatedValues[event.fieldId] = event.value;
      
      emit(currentState.copyWith(fieldValues: updatedValues));
    }
  }

  Future<void> _onSaveDraft(
    SaveDraft event,
    Emitter<CollectionState> emit,
  ) async {
    // Sauvegarde locale
  }

  Future<void> _onSubmitCollection(
    SubmitCollectionEvent event,
    Emitter<CollectionState> emit,
  ) async {
    if (state is CollectionLoaded) {
      final currentState = state as CollectionLoaded;
      
      // Validation
      if (!_validateFields(currentState)) {
        emit(CollectionError('Veuillez remplir tous les champs obligatoires'));
        return;
      }
      
      emit(CollectionLoading());
      
      final result = await submitCollection(currentState.collection.id);
      
      result.fold(
        (failure) => emit(CollectionError(failure.message)),
        (_) => emit(CollectionSubmitted()),
      );
    }
  }

  bool _validateFields(CollectionLoaded state) {
    // Logique de validation
    return true;
  }
}
```

### 6. Page (UI)

```dart
// lib/features/collection/presentation/pages/collection_page.dart
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../bloc/collection_bloc.dart';
import '../widgets/field_renderer/field_renderer.dart';
import '../widgets/form_progress_bar.dart';

class CollectionPage extends StatefulWidget {
  final String assignmentId;

  const CollectionPage({Key? key, required this.assignmentId}) : super(key: key);

  @override
  State<CollectionPage> createState() => _CollectionPageState();
}

class _CollectionPageState extends State<CollectionPage> {
  late PageController _pageController;
  int _currentPage = 0;

  @override
  void initState() {
    super.initState();
    _pageController = PageController();
    context.read<CollectionBloc>().add(LoadChecklist(widget.assignmentId));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Collecte de données'),
        actions: [
          IconButton(
            icon: const Icon(Icons.save),
            onPressed: () {
              context.read<CollectionBloc>().add(SaveDraft());
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Brouillon sauvegardé')),
              );
            },
          ),
        ],
      ),
      body: BlocConsumer<CollectionBloc, CollectionState>(
        listener: (context, state) {
          if (state is CollectionError) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(content: Text(state.message), backgroundColor: Colors.red),
            );
          } else if (state is CollectionSubmitted) {
            Navigator.of(context).pop();
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(
                content: Text('Collecte soumise avec succès'),
                backgroundColor: Colors.green,
              ),
            );
          }
        },
        builder: (context, state) {
          if (state is CollectionLoading) {
            return const Center(child: CircularProgressIndicator());
          }

          if (state is CollectionLoaded) {
            return Column(
              children: [
                FormProgressBar(
                  total: _getTotalFields(state.checklist),
                  completed: state.fieldValues.length,
                ),
                Expanded(
                  child: PageView.builder(
                    controller: _pageController,
                    onPageChanged: (page) {
                      setState(() => _currentPage = page);
                    },
                    itemCount: state.checklist.sections.length,
                    itemBuilder: (context, sectionIndex) {
                      final section = state.checklist.sections[sectionIndex];
                      return _buildSection(state, section);
                    },
                  ),
                ),
                _buildNavigationButtons(state),
              ],
            );
          }

          return const Center(child: Text('Erreur de chargement'));
        },
      ),
    );
  }

  Widget _buildSection(CollectionLoaded state, ChecklistSection section) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Text(
          section.title,
          style: Theme.of(context).textTheme.headlineSmall,
        ),
        if (section.description != null) ...[
          const SizedBox(height: 8),
          Text(
            section.description!,
            style: Theme.of(context).textTheme.bodyMedium,
          ),
        ],
        const SizedBox(height: 24),
        ...section.fields.map((field) => Padding(
              padding: const EdgeInsets.only(bottom: 24),
              child: FieldRenderer(
                field: field,
                value: state.fieldValues[field.id],
                onChanged: (value) {
                  context.read<CollectionBloc>().add(
                        UpdateField(field.id, value),
                      );
                },
              ),
            )),
      ],
    );
  }

  Widget _buildNavigationButtons(CollectionLoaded state) {
    final isFirstSection = _currentPage == 0;
    final isLastSection = _currentPage == state.checklist.sections.length - 1;

    return Container(
      padding: const EdgeInsets.all(16),
      child: Row(
        children: [
          if (!isFirstSection)
            Expanded(
              child: ElevatedButton(
                onPressed: () {
                  _pageController.previousPage(
                    duration: const Duration(milliseconds: 300),
                    curve: Curves.easeInOut,
                  );
                },
                child: const Text('Précédent'),
              ),
            ),
          if (!isFirstSection && !isLastSection) const SizedBox(width: 16),
          Expanded(
            child: ElevatedButton(
              onPressed: () {
                if (isLastSection) {
                  _showSubmitConfirmation(context);
                } else {
                  _pageController.nextPage(
                    duration: const Duration(milliseconds: 300),
                    curve: Curves.easeInOut,
                  );
                }
              },
              style: isLastSection
                  ? ElevatedButton.styleFrom(backgroundColor: Colors.green)
                  : null,
              child: Text(isLastSection ? 'Soumettre' : 'Suivant'),
            ),
          ),
        ],
      ),
    );
  }

  void _showSubmitConfirmation(BuildContext context) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Confirmer la soumission'),
        content: const Text(
          'Êtes-vous sûr de vouloir soumettre cette collecte ? '
          'Vous ne pourrez plus la modifier.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(),
            child: const Text('Annuler'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.of(ctx).pop();
              context.read<CollectionBloc>().add(SubmitCollectionEvent());
            },
            child: const Text('Soumettre'),
          ),
        ],
      ),
    );
  }

  int _getTotalFields(Checklist checklist) {
    return checklist.sections.fold(0, (sum, section) => sum + section.fields.length);
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }
}
```

### 7. Widget de Champ Dynamique

```dart
// lib/features/collection/presentation/widgets/field_renderer/field_renderer.dart
import 'package:flutter/material.dart';
import '../../../domain/entities/checklist.dart';
import 'text_field_widget.dart';
import 'number_field_widget.dart';
import 'select_field_widget.dart';
import 'photo_field_widget.dart';
import 'signature_field_widget.dart';
import 'location_field_widget.dart';

class FieldRenderer extends StatelessWidget {
  final FieldDefinition field;
  final dynamic value;
  final ValueChanged<dynamic> onChanged;

  const FieldRenderer({
    Key? key,
    required this.field,
    required this.value,
    required this.onChanged,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    switch (field.type) {
      case FieldType.text:
      case FieldType.email:
      case FieldType.phone:
      case FieldType.textarea:
        return TextFieldWidget(
          field: field,
          value: value,
          onChanged: onChanged,
        );

      case FieldType.number:
        return NumberFieldWidget(
          field: field,
          value: value,
          onChanged: onChanged,
        );

      case FieldType.select:
      case FieldType.multiSelect:
        return SelectFieldWidget(
          field: field,
          value: value,
          onChanged: onChanged,
        );

      case FieldType.photo:
        return PhotoFieldWidget(
          field: field,
          value: value,
          onChanged: onChanged,
        );

      case FieldType.signature:
        return SignatureFieldWidget(
          field: field,
          value: value,
          onChanged: onChanged,
        );

      case FieldType.location:
        return LocationFieldWidget(
          field: field,
          value: value,
          onChanged: onChanged,
        );

      default:
        return Text('Type de champ non supporté: ${field.type}');
    }
  }
}
```

## Dépendances (pubspec.yaml)

```yaml
name: factory_mobile
description: Application mobile de collecte de données d'usine

version: 1.0.0+1

environment:
  sdk: '>=3.0.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter

  # State Management
  flutter_bloc: ^8.1.3
  equatable: ^2.0.5

  # Networking
  dio: ^5.3.3
  connectivity_plus: ^5.0.1

  # Local Storage
  sqflite: ^2.3.0
  hive: ^2.2.3
  hive_flutter: ^1.1.0
  flutter_secure_storage: ^9.0.0
  shared_preferences: ^2.2.2

  # Functional Programming
  dartz: ^0.10.1

  # Dependency Injection
  get_it: ^7.6.4
  injectable: ^2.3.2

  # UI
  cached_network_image: ^3.3.0
  flutter_svg: ^2.0.9
  intl: ^0.18.1
  google_fonts: ^6.1.0

  # Forms & Validation
  formz: ^0.6.1

  # Camera & Images
  image_picker: ^1.0.4
  image_cropper: ^5.0.0
  flutter_image_compress: ^2.1.0
  camera: ^0.10.5+5

  # Signature
  signature: ^5.4.1

  # Location
  geolocator: ^10.1.0
  geocoding: ^2.1.1

  # Permissions
  permission_handler: ^11.0.1

  # Other
  path_provider: ^2.1.1
  uuid: ^4.2.1
  logger: ^2.0.2+1

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.1
  build_runner: ^2.4.7
  injectable_generator: ^2.4.1
  hive_generator: ^2.0.1
  mockito: ^5.4.4
  bloc_test: ^9.1.5
```

## Gestion du Mode Offline

### Stratégie de Stockage Local

```dart
// lib/core/storage/database/app_database.dart
import 'package:sqflite/sqflite.dart';
import 'package:path/path.dart';

class AppDatabase {
  static Database? _database;
  static const String dbName = 'factory_app.db';
  static const int dbVersion = 1;

  Future<Database> get database async {
    if (_database != null) return _database!;
    _database = await _initDatabase();
    return _database!;
  }

  Future<Database> _initDatabase() async {
    final dbPath = await getDatabasesPath();
    final path = join(dbPath, dbName);

    return await openDatabase(
      path,
      version: dbVersion,
      onCreate: _onCreate,
      onUpgrade: _onUpgrade,
    );
  }

  Future<void> _onCreate(Database db, int version) async {
    // Table pour les checklists en cache
    await db.execute('''
      CREATE TABLE checklists (
        id TEXT PRIMARY KEY,
        data TEXT NOT NULL,
        cached_at INTEGER NOT NULL
      )
    ''');

    // Table pour les collectes (brouillons et en attente de sync)
    await db.execute('''
      CREATE TABLE collections (
        id TEXT PRIMARY KEY,
        assignment_id TEXT NOT NULL,
        checklist_id TEXT NOT NULL,
        data TEXT NOT NULL,
        status TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        synced_at INTEGER
      )
    ''');

    // Table pour la queue de synchronisation
    await db.execute('''
      CREATE TABLE sync_queue (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        entity_type TEXT NOT NULL,
        entity_id TEXT NOT NULL,
        operation TEXT NOT NULL,
        payload TEXT NOT NULL,
        status TEXT NOT NULL,
        retry_count INTEGER DEFAULT 0,
        error_message TEXT,
        created_at INTEGER NOT NULL
      )
    ''');

    // Table pour les fichiers (photos, signatures)
    await db.execute('''
      CREATE TABLE attachments (
        id TEXT PRIMARY KEY,
        collection_id TEXT NOT NULL,
        field_id TEXT NOT NULL,
        file_path TEXT NOT NULL,
        file_type TEXT NOT NULL,
        uploaded BOOLEAN DEFAULT 0,
        upload_url TEXT,
        created_at INTEGER NOT NULL
      )
    ''');
  }

  Future<void> _onUpgrade(Database db, int oldVersion, int newVersion) async {
    // Gestion des migrations
  }
}
```

## Tests

### Test Unitaire

```dart
// test/features/collection/domain/usecases/submit_collection_test.dart
import 'package:flutter_test/flutter_test.dart';
import 'package:mockito/mockito.dart';
import 'package:mockito/annotations.dart';
import 'package:dartz/dartz.dart';

@GenerateMocks([CollectionRepository])
void main() {
  late SubmitCollection usecase;
  late MockCollectionRepository mockRepository;

  setUp(() {
    mockRepository = MockCollectionRepository();
    usecase = SubmitCollection(mockRepository);
  });

  const collectionId = '123';

  test('should submit collection successfully', () async {
    // Arrange
    when(mockRepository.submitCollection(any))
        .thenAnswer((_) async => const Right(null));

    // Act
    final result = await usecase(collectionId);

    // Assert
    expect(result, const Right(null));
    verify(mockRepository.submitCollection(collectionId));
    verifyNoMoreInteractions(mockRepository);
  });
}
```

## Configuration Android

### android/app/build.gradle

```gradle
android {
    compileSdkVersion 34
    
    defaultConfig {
        applicationId "com.company.factory_mobile"
        minSdkVersion 24
        targetSdkVersion 34
        versionCode 1
        versionName "1.0.0"
    }
}
```

### Permissions (android/app/src/main/AndroidManifest.xml)

```xml
<manifest>
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
</manifest>
```

## Configuration iOS

### ios/Runner/Info.plist

```xml
<key>NSCameraUsageDescription</key>
<string>L'application a besoin d'accéder à la caméra pour prendre des photos</string>

<key>NSPhotoLibraryUsageDescription</key>
<string>L'application a besoin d'accéder à vos photos</string>

<key>NSLocationWhenInUseUsageDescription</key>
<string>L'application a besoin de votre localisation pour la collecte de données</string>
```

## Bonnes Pratiques

### 1. Clean Architecture
- Séparation claire des responsabilités
- Domain au centre, indépendant du framework
- Dépendances vers l'intérieur

### 2. State Management avec BLoC
- Un BLoC par feature
- Events immutables
- States immutables
- Tests facilités

### 3. Offline First
- Toujours sauvegarder localement d'abord
- Synchronisation en arrière-plan
- Gestion des conflits

### 4. Performance
- Lazy loading des images
- Compression des photos avant upload
- Pagination des listes
- Cache intelligent

### 5. UX Mobile
- Indicateurs de chargement
- Messages d'erreur clairs
- Feedback visuel immédiat
- Mode offline transparent

## Build et Déploiement

### Build Android (APK)
```bash
flutter build apk --release
```

### Build Android (App Bundle)
```bash
flutter build appbundle --release
```

### Build iOS
```bash
flutter build ios --release
```

## Conclusion

Cette architecture Flutter suit les meilleures pratiques avec Clean Architecture et BLoC, offrant une application robuste, testable et maintenable pour la collecte de données terrain en mode offline.
