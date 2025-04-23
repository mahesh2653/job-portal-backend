import ApplicationModel from "../model/application.model";
import IApplication from "../types/application.type";

export default class ApplicationService {
  // Create a new application
  static createApplication = async (data: IApplication) => {
    const application = await ApplicationModel.create(data);
    return application;
  };

  // Get an application by ID
  static getApplication = async (id: string) => {
    const application = await ApplicationModel.findById(id)
      .populate("jobId", "title company")
      .populate("userId", "name email");
    return application;
  };

  // Get all applications for an employer (by job postedBy)
  static getEmployerApplications = async (postedBy: string) => {
    const applications = await ApplicationModel.find()
      .populate({
        path: "jobId",
        match: { postedBy },
        select: "title company",
      })
      .populate("userId", "name email")
      .lean();
    // Filter out applications where jobId is null (due to match)
    return applications.filter((app) => app.jobId);
  };

  // Get all applications for a job seeker (by userId)
  static getJobSeekerApplications = async (userId: string) => {
    const applications = await ApplicationModel.find({ userId })
      .populate("jobId", "title company")
      .lean();
    return applications;
  };

  // Update an application by ID
  static updateApplication = async (
    id: string,
    data: Partial<IApplication>
  ) => {
    const application = await ApplicationModel.findByIdAndUpdate(id, data, {
      new: true,
    });
    return application;
  };

  // Delete an application by ID
  static deleteApplication = async (id: string) => {
    const application = await ApplicationModel.findByIdAndDelete(id);
    return application;
  };

  // Get applications by any filter
  static getApplicationsByAny = async (filter: object) => {
    const applications = await ApplicationModel.find(filter)
      .populate("jobId", "title company")
      .populate("userId", "name email")
      .lean();
    return applications;
  };
}
