import pandas as pd
import sys

# Original File Path
file_path = r'c:\Users\Atul Verma\.openclaw\workspace\RajShree_Project\Rajshree Learning Project\Rajshree_Learning_Data_Master.xlsx'
backup_path = r'c:\Users\Atul Verma\.openclaw\workspace\RajShree_Project\Rajshree Learning Project\Rajshree_Learning_Data_Master_backup.xlsx'

print("Starting 250-Column Database Expansion...")

try:
    # 1. Back up original file first just in case
    df_original = pd.read_excel(file_path)
    df_original.to_excel(backup_path, index=False)
    print(f"Backup created at: {backup_path}")

    # 2. Define the new columns (1-20 are already there)
    new_columns = [
        # Core Management (8)
        'ID', 'Sort_Order', 'Is_Active', 'Is_Deleted', 'Created_At', 'Updated_At', 'Version', 'Notes_Internal',
        # Extended Media (8)
        'Video_Path', 'Animation_Path', 'Thumbnail_Path', 'Background_Audio_Path', 'SVG_Path', 'Interactive_Widget_Path', 'Sprite_Sheet_Path', '3D_Model_Path',
        # Multi-Language (9)
        'Display_Letter_Hi', 'Display_Word_Hi', 'Display_Letter_Hing', 'Display_Word_Hing', 'Description_En', 'Description_Hi', 'Description_Hing', 'Phonetic_Pronunciation_En', 'Phonetic_Pronunciation_Hi',
        # Typography & Layout (10)
        'Font_Family_En', 'Font_Family_Hi', 'Font_Weight', 'Font_Size_Rem', 'Text_Color_Hex', 'Background_Color_Hex', 'Border_Color_Hex', 'Animation_Class', 'Layout_Template', 'CSS_Custom_Classes',
        # Educational Metadata (14)
        'Keywords_Tags', 'Difficulty_Level', 'Content_Type', 'Interaction_Type', 'Duration_Sec', 'App_Version_Target', 'Platform_Target', 'Is_Premium', 'Learning_Objective', 'Prerequisites', 'Assessment_Score_Weight', 'Correct_Answer_Reference', 'Curriculum_Standard_Id', 'Recommended_Age',
        # Accessibility / System (9)
        'Alt_Text_En', 'Alt_Text_Hi', 'Aria_Label_Context', 'Requires_Internet', 'File_Size_Bytes', 'Author_Creator', 'License_Type', 'Parental_Lock', 'Analytics_Event_ID',
        # Adv. Media & Gamification (9)
        'Subtitle_Path_En', 'Subtitle_Path_Hi', 'Subtitle_Path_Hing', 'Audio_Duration_Ms', 'Video_Duration_Ms', 'Unlocks_Achievement_ID', 'Required_Streak_Days', 'XP_Reward', 'Max_Attempts_Allowed',
        # Workflow & Social (13)
        'QA_Status', 'QA_Notes', 'Reviewed_By', 'Publish_Date', 'Expiry_Date', 'Parent_Category_ID', 'Related_Item_IDs', 'External_Resource_Link', 'Printable_Worksheet_Path', 'Share_Image_Path', 'Share_Text_En', 'Share_Text_Hi', 'Target_Region',
        # Institutional / B2B (30)
        'Education_Board_Target', 'Curriculum_Subject', 'Curriculum_Topic', 'Development_Domain', 'Compliance_Standard_ID', 'School_Grade_Level', 'Assignment_Eligible', 'Default_Assignment_Duration_Days', 'Group_Activity_Type', 'Classroom_Resource_Required', 'Peer_Review_Enabled', 'Teacher_Approval_Required', 'Cognitive_Weight', 'Motor_Skill_Weight', 'Expected_Completion_Time_Min', 'Common_Misconception_En', 'Common_Misconception_Hi', 'Remedial_Action_ID', 'B2B_Tenant_Visibility', 'B2B_Exclusive_Flag', 'Subscription_Tier_Required', 'White_Label_Logo_Path', 'Custom_Branding_Color', 'Data_Privacy_Level', 'Offline_Bundle_ID', 'Pre_Download_Priority_B2B', 'Sync_Conflict_Strategy', 'Local_Cache_Path', 'Last_Synced_At', 'Data_Integrity_Hash',
        # Gen-AI & Monetization (20)
        'AI_Context_Prompt_En', 'AI_Context_Prompt_Hi', 'AI_Generated_Quiz_Enabled', 'AI_Tutor_Persona', 'Dynamic_Story_Seed', 'Content_Vector_Embedding_ID', 'Speech_Analysis_Expected_Phonemes', 'Sentiment_Target', 'AI_Content_Safety_Score', 'Generative_Image_Seed', 'In_App_Purchase_SKU_Apple', 'In_App_Purchase_SKU_Google', 'Merchandise_Link', 'Merchandise_Discount_Code', 'Ad_Sponsor_ID', 'Sponsor_Logo_Path', 'Subscription_Upsell_Trigger', 'Free_Trial_Allowed', 'Virtual_Currency_Cost', 'Virtual_Currency_Reward_First_Time',
        # Parent Dash & Ecosystem (20)
        'Parent_Dashboard_Category', 'Parent_Email_Update_Trigger', 'Parent_Tip_En', 'Parent_Tip_Hi', 'Screen_Time_Category', 'Weekly_Report_Highlight', 'Parental_Intervention_Flag', 'Skill_Decay_Days', 'Child_Feedback_Rating', 'Parent_Override_Blocked', 'App_ID_Flashcards', 'App_ID_StoryBooks', 'App_ID_Games', 'External_API_Endpoint', 'Deeplink_URL_Scheme', 'Push_Notification_Payload_En', 'Push_Notification_Payload_Hi', 'Webhook_On_Completion', 'Third_Party_Authenticator_ID', 'IoT_Device_Trigger',
        # Global Legal Compliance (10)
        'COPPA_Compliant', 'GDPR_K_Compliant', 'Requires_Age_Gate', 'Content_Warning_Flag', 'Data_Retention_Policy', 'Legal_Disclaimer_En', 'Legal_Disclaimer_Hi', 'Copyright_Filing_Number', 'Auditor_Review_Date', 'Embargo_Date_Until',
        # The Ultimate Frontier (50)
        'Cultural_Relevance_Flag', 'Dialect_Variant_En', 'Dialect_Variant_Hi', 'Voiceover_Accent_Preference', 'Festival_Campaign_ID', 'Haptic_Feedback_Pattern', 'Sound_Effect_Success', 'Sound_Effect_Error', 'Confetti_Color_Theme', 'Reward_Animation_Path', 'Hint_Text', 'Lesson_Plan_ID', 'Teacher_Notes', 'Classroom_Activity', 'Homework_Suggestion', 'Expected_Learning_Outcome', 'AB_Test_Variant', 'Feature_Flag_Required', 'Cache_TTL_Seconds', 'Preload_Priority', 'AR_Plane_Required', 'AR_Scale_Factor', 'VR_Environment_Spawn_Loc', 'VR_Interactive_Grab', 'Spatial_Audio_Source_Path', 'MetaTour_Scene_ID', 'Hand_Tracking_Gesture_Required', 'AR_Tracker_Image_Path', 'Face_Filter_Asset_Path', 'Depth_Map_Enabled', 'Target_Attention_Span_Min', 'Dominant_Color_Psychology', 'Frustration_Threshold_Hints', 'Praise_Frequency_Multiplier', 'Night_Mode_Friendly', 'Morning_Routine_Flag', 'Paced_Breathing_Sync', 'Hyperactivity_Reduction_Mode', 'Autism_Spectrum_Friendly', 'Dyslexia_Friendly_Override', 'Max_RAM_Footprint_MB', 'Target_FPS', 'GPU_Acceleration_Required', 'Asset_Resolution_Variant', 'Compression_Algorithm', 'Fallback_Strategy', 'Telemtry_Sampling_Rate', 'Critical_Path_Render', 'Deprecated_In_Version', 'Schema_Migration_Status', 'Principal_Override_Allowed', 'District_Wide_Broadcast', 'Attendance_Marker', 'Lunch_Break_Allowed', 'Exam_Mode_Lockdown', 'Extracurricular_Category', 'Parent_Teacher_Conf_Flag', 'School_Bus_Mode', 'Library_Checkout_ID', 'Substitute_Teacher_Friendly', 'Left_Handed_UI_Flip', 'Color_Blindness_Palette', 'Offline_Printable_QR_Code', 'Braille_Display_Output', 'Sign_Language_Video_Path', 'Pet_Friendly_Audio', 'Time_Zone_Sensitive', 'External_Hardware_Required', 'Easter_Egg_Trigger', 'End_Of_The_Internet'
    ]

    print(f"Original shape before append: {df_original.shape}")
    print(f"Number of new columns to add: {len(new_columns)}")

    # 3. Append missing columns iteratively
    for col in new_columns:
        if col not in df_original.columns:
            df_original[col] = None # Or "" if string blank is preferred. None stays cleaner in pandas.

    print(f"Final shape after append: {df_original.shape}")

    # 4. Save the expanded file
    df_original.to_excel(file_path, index=False)
    print("SUCCESS: Master Excel file successfully expanded to 250 columns.")

except Exception as e:
    print(f"ERROR: Failed to update excel sheet. Details: {e}")
