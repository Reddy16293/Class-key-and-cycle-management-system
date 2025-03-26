package com.example.demo.model;

import jakarta.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "borrow_history")
public class BorrowHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @ManyToOne
    @JoinColumn(name = "bicycle_id", nullable=true)
    private Bicycle bicycle; // Nullable since a user may borrow only a key

    @ManyToOne
    @JoinColumn(name = "classroom_key_id", nullable=true)
    private ClassroomKey classroomKey; // Store classroom key borrowing

    @Column(nullable = false)
    private Timestamp borrowTime;

    @Column
    private Timestamp returnTime;

    @Column
    private String feedback;

    @Column
    private String conditionDescription; // Changed from conditionRating

    @Column
    private Integer experienceRating; // Keep star rating for experience
    
    @Column(nullable = false)
    private Boolean isReturned = false;  // Default value set to false

    // Getters and Setters
    public Boolean getIsReturned() {
        return isReturned;
    }

    public void setIsReturned(Boolean isReturned) {
        this.isReturned = isReturned;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getStudent() {
        return student;
    }

    public void setStudent(User student) {
        this.student = student;
    }

    public Bicycle getBicycle() {
        return bicycle;
    }

    public void setBicycle(Bicycle bicycle) {
        this.bicycle = bicycle;
    }

    public ClassroomKey getClassroomKey() {
        return classroomKey;
    }

    public void setClassroomKey(ClassroomKey classroomKey) {
        this.classroomKey = classroomKey;
    }

    public Timestamp getBorrowTime() {
        return borrowTime;
    }

    public void setBorrowTime(Timestamp borrowTime) {
        this.borrowTime = borrowTime;
    }

    public Timestamp getReturnTime() {
        return returnTime;
    }

    public void setReturnTime(Timestamp returnTime) {
        this.returnTime = returnTime;
    }

    public String getFeedback() {
        return feedback;
    }

    public void setFeedback(String feedback) {
        this.feedback = feedback;
    }
   

	public String getConditionDescription() {
		return conditionDescription;
	}

	public void setConditionDescription(String conditionDescription) {
		this.conditionDescription = conditionDescription;
	}

	public Integer getExperienceRating() {
		return experienceRating;
	}

	public void setExperienceRating(Integer experienceRating) {
		this.experienceRating = experienceRating;
	}
    
}